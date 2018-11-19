class WebsocketMessage {
    constructor(rawMessage) {
        // Validates JSON format
        if(typeof rawMessage === 'string') {
            this.rawMessage = JSON.parse(rawMessage);
        } else if(typeof rawMessage === 'object') {
            this.rawMessage = rawMessage;
        } else {
            throw new Error('Invalid raw message');
        }

        if (typeof this.rawMessage !== 'object' || Object.keys(this.rawMessage).length === 0) {
            throw new Error('Invalid raw message');
        }

        // Assigns message properties
        this.url = this.rawMessage.url;
        this.payload = this.rawMessage.payload;
    }
}

class WebSocketDispatcher {
    constructor(routeMappings, logger) {
        this.routeMappings = routeMappings || {};
        this.logger = logger || null;
    }

    // Sends an error message over the websocket and logs it
    static sendErrorMessage(websocket, logger, errorMsg) {
        // Craft error message
        const response = {
            error: true,
            error_msg: errorMsg
        };
        // Send error message
        websocket.send(JSON.stringify(response));
        // Log error
        if (logger) {
            logger.error(errorMsg);
        }
    }

    // "Static" method
    middleware(ctx, next) {
        const pocketNodeServer = ctx.pocketNodeServer,
              websocketDispatcher = pocketNodeServer ? pocketNodeServer.websocketDispatcher : null,
              websocket = ctx.websocket;

        if (websocketDispatcher === null) {
            throw Error('Invalid Websocket Dispatcher');
        }

        websocket.on('message', websocketDispatcher.getOnMessageCallback(websocket, websocketDispatcher));
        return next(ctx);
    }

    // Returns the onMessageCallback for the current connection
    getOnMessageCallback(websocket, websocketDispatcher) {
        var websocket = websocket ? websocket : null,
            websocketDispatcher = websocketDispatcher ? websocketDispatcher : null,
            logger = this.logger;

        return async function(message) {
            // Error out in case of invalid websocket instance
            if (websocket === null) {
                const error = new Error('Invalid websocket instance');
                if (logger) {
                    logger.error(error);
                }
                return;
            }

            // Validate message format
            var wsMessage = null;
            try {
                wsMessage = new WebsocketMessage(message);
            } catch (error) {
                WebSocketDispatcher.sendErrorMessage(websocket, logger, error.message);
                return;
            }

            // Send error message if websocketDispatcher instance is invalid
            if (websocketDispatcher === null) {
                WebSocketDispatcher.sendErrorMessage(websocket, logger, 'Unable to find matching URL dispatcher for message');
                return;
            }

            // Get routecontroller and execute it
            const routeController = websocketDispatcher.getRouteController(wsMessage.url);

            // Check if there's a controller for the given route
            if (routeController === null) {
                WebSocketDispatcher.sendErrorMessage(websocket, logger, 'Invalid route');
                return;
            }

            // Always await routeController as it must be an async function
            try {
                const response = await routeController(wsMessage, logger);
                // Emit response message
                websocket.send(JSON.stringify(response));
            } catch(error) {
                WebSocketDispatcher.sendErrorMessage(websocket, logger, error.message);
                return;
            }
        }
    }

    getRouteController(route) {
        var routeController = null;

        if(this.routeMappings.hasOwnProperty(route)) {
            routeController = this.routeMappings[route];
        }

        return routeController;
    }
}

module.exports = WebSocketDispatcher;