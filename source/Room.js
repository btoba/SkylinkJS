/**
 * Handles the room connection.
 * @class Room
 * @for Skylink
 * @since 0.6.0
 */
function Room(name, listener) {
  'use strict';

  // Reference of instance
  var com = this;

  /**
   * The room name.
   * @attribute name
   * @type String
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.name = name;

  /**
   * The room id.
   * @attribute name
   * @type String
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.id = null;
  
  /**
   * The room token.
   * @attribute name
   * @type String
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.token = null;
  
  /**
   * The room key.
   * @attribute key
   * @type String
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.key = null;
  
  /**
   * The room start date timestamp (ISO format) for persistent mode.
   * @attribute startDateTime
   * @type String
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.startDateTime = null;
  
  /**
   * The room duration for persistent mode.
   * @attribute duration
   * @type Integer
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.duration = null;

  /**
   * The request path to the api server.
   * @attribute path
   * @type String
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.apiPath = null;

  /**
   * The room api owner.
   * @attribute owner
   * @type String
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.owner = null;

  /**
   * The user set settings for the room.
   * @attribute credentials
   * @param {Integer} duration The room duration set by user.
   * @param {String} hash The hashed secret generated by user.
   * @param {String} startDateTime The room start date timestamp (ISO format) set by user.
   * @type JSON
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.credentials = globals.credentials;

  /**
   * The self user connection.
   * @attribute self
   * @type Self
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.self = null;
  
  /**
   * The user self custom user data.
   * @attribute self
   * @type JSON|String
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.selfData = null;
  
  /**
   * The user self existing local stream connection.
   * @attribute stream
   * @param {Stream} <streamId> The stream connected to room.
   * @type JSON
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.streams = {};

  /**
   * The list of users connected to room.
   * @attribute users
   * @param {User} <userId> The user connected to room.
   * @type JSON
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.users = {};

  /**
   * The list of components connected to room.
   * - E.g. MCU, Recording
   * @attribute user
   * @param {User} [n=*] The user connected to room.
   * @type JSON
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.components = {};

  /**
   * The room duration.
   * @attribute startDateTime
   * @type Socket
   * @required
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.socket = null;
  
  /**
   * The room readyState.
   * @attribute readyState
   * @type Integer
   * @required
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.readyState = 0;
  
  /**
   * The room TURN/STUN servers connection.
   * @attribute iceServers
   * @param {Array} iceServers The list of ICE servers.
   * @param {JSON} <iceServers.n> The ICE server.
   * @type JSON
   * @required
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.iceServers = {};
  
  /**
   * The room locked state.
   * @attribute locked
   * @type Boolean
   * @required
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.locked = false;

  /**
   * The handler that manages all triggers or relaying events.
   * @attribute handler
   * @type Function
   * @private
   * @for Room
   * @since 0.6.0
   */
  com.handler = function (event, data) {
    RoomHandler(com, event, data, listener);
  };

  
  /**
   * Function to subscribe to when room ready state has changed.
   * @method onreadystatechange
   * @for Room
   * @since 0.6.0
   */
  com.onreadystatechange = function () {};

  /**
   * Function to subscribe to when self has joined the room.
   * @method onjoin
   * @for Room
   * @since 0.6.0
   */
  com.onjoin = function () {};
  
  /**
   * Function to subscribe to when self has been kicked out of room.
   * @method onlock
   * @for Room
   * @since 0.6.0
   */
  com.onkick = function () {};
  
  /**
   * Function to subscribe to when self is warned by server.
   * @method onunlock
   * @for Room
   * @since 0.6.0
   */
  com.onwarn = function () {};

  /**
   * Function to subscribe to when room has been locked.
   * @method onlock
   * @for Room
   * @since 0.6.0
   */
  com.onlock = function () {};
  
  /**
   * Function to subscribe to when room has been unlocked.
   * @method onunlock
   * @for Room
   * @since 0.6.0
   */
  com.onunlock = function () {};
  
  /**
   * Function to subscribe to when self has leave the room.
   * @method onleave
   * @for Room
   * @since 0.6.0
   */
  com.onleave = function () {};


  /**
   * Starts the connection to the room.
   * @method join
   * @trigger peerJoined, mediaAccessRequired
   * @for Room
   * @since 0.6.0
   */
  com.join = function (stream, config) {
    config = config || {};

    com.self.bandwidth = StreamParser.parseBandwidthConfig(config.bandwidth);
    com.self.data = config.userData;
  
    if (!fn.isEmpty(stream)) {
      com.self.addStreamConnection(stream, 'main');
    }

    com.socket.connect();
    console.log('->joined');
  };

  /**
   * Stops the connection to the room.
   * @method leave
   * @trigger peerJoined, mediaAccessRequired
   * @for Room
   * @since 0.6.0
   */
  com.leave = function () {
    com.socket.disconnect();
  };
  
  /**
   * Locks the Room.
   * @method lock
   * @for Room
   * @since 0.6.0
   */
  com.lock = function (options) {
    com.socket.send({
      type: 'roomLockEvent',
      mid: com.self.id,
      rid: com.id,
      lock: true
    });
    
    com.handler('room:lock', {
      userId: com.self.id
    });
  };

  /**
   * Unlocks the Room.
   * @method unlock
   * @for Room
   * @since 0.6.0
   */
  com.unlock = function () {
    com.socket.send({
      type: 'roomLockEvent',
      mid: com.self.id,
      rid: com.id,
      lock: false
    });
    
    com.handler('room:unlock', {
      userId: com.self.id
    });
  };

  /**
   * Sends a another stream to users.
   * @method addStreamConnection
   * @param {Stream} stream The stream object.
   * @for Room
   * @since 0.6.0
   */
  com.addStreamConnection = function (stream) {
    var connectionId = fn.generateUID();

    com.self.addStreamConnection(stream, connectionId);
    
    stream.parentHandler = com.handler;
    
    fn.forEach(com.users, function (user, key) {
      data.stream = stream;
      user.handler('message:enter', data);
    });
  };

  
  /**
   * Handles the self connection to the room.
   * @class Self
   * @for Skylink
   * @extend Room
   * @since 0.6.0
   */
  function Self (config) {
    // Reference of instance
    var subcom = this;

    /**
     * The self user id.
     * @attribute name
     * @type String
     * @private
     * @for Self
     * @since 0.6.0
     */
    subcom.id = null;
    
    /**
     * The self user data.
     * @attribute data
     * @type String | JSON
     * @private
     * @for Self
     * @since 0.6.0
     */
    subcom.data = config.data;
    
    /**
     * The self user username.
     * @attribute username
     * @type String
     * @private
     * @for Self
     * @since 0.6.0
     */
    subcom.username = config.username;
    
    /**
     * The self user timestamp (ISO format).
     * @attribute timeStamp
     * @type String
     * @private
     * @for Self
     * @since 0.6.0
     */
    subcom.timeStamp = config.timeStamp;
    
    /**
     * The self user credential.
     * @attribute token
     * @type String
     * @private
     * @for Self
     * @since 0.6.0
     */
    subcom.token = config.token;
    
    /**
     * The self user local stream connection.
     * @attribute stream
     * @param {JSON} <connectionId> The stream connection to users.
     * @param {Array} <connectionId.targetUsers> The target users.
     * @param {Stream} <connectionId.stream> The stream connected to room.
     * @type JSON
     * @private
     * @for Self
     * @since 0.6.0
     */
    subcom.streams = {};
    
    /**
     * The self user browser agent information.
     * @attribute agent
     * @type JSON
     * @private
     * @for Self
     * @since 0.6.0
     */
    subcom.agent = {
      name: window.webrtcDetectedBrowser,
      version: window.webrtcDetectedVersion,
      webRTCType: window.webrtcDetectedType
    };
    
    /**
     * The self user bandwidth configuration.
     * @attribute agent
     * @type JSON
     * @private
     * @for Self
     * @since 0.6.0
     */
    subcom.bandwidth = {};
    
    /**
     * The handler that manages all triggers or relaying events.
     * @attribute handler
     * @type Function
     * @private
     * @for Self
     * @since 0.6.0
     */
    subcom.handler = function (event, data) {
      data.id = subcom.id;
      
      log.debug('SelfHandler:', event, data); 

      RoomHandler(com, event, data, listener);
    };

    
    /**
     * Function to subscribe to when self user custom user data is updated.
     * @method onupdate
     * @for Self
     * @since 0.6.0
     */
    subcom.onupdate = function () {};
    
    /**
     * Function to subscribe to when self has added a stream connection.
     * @method onaddstreamconnection
     * @for Self
     * @since 0.6.0
     */
    subcom.onaddstreamconnection = function () {};

    /**
     * Function to subscribe to when self has stopped a stream connection.
     * @method onaddstream
     * @for Self
     * @since 0.6.0
     */
    subcom.onremovestreamconnection = function () {};
    
    /**
     * Function to subscribe to when self has been disconnected from the room.
     * @method ondisconnect
     * @for Self
     * @since 0.6.0
     */
    subcom.ondisconnect = function () {};
    
  
    /**
     * Updates the self user data.
     * @method update
     * @for Self
     * @since 0.6.0
     */
    subcom.update = function (data) {
      subcom.data = data;
      
      com.socket.send({
        type: 'updateUserEvent',
        mid: subcom.id,
        rid: com.id,
        userData: subcom.data
      });
      
      subcom.handler('self:update', {
        data: subcom.data
      });
    };

    /**
     * Starts a new stream connection.
     * @method addStreamConnection
     * @param {Stream} stream The stream object.
     * @param {Array|String} The array or string "main".
     * @for Self
     * @since 0.6.0
     */
    subcom.addStreamConnection = function (stream, connectionId) {
      stream.sourceType = 'local';

      var connection = {
        id: connectionId,
        stream: stream
      };
      
      subcom.streams[connectionId] = connection;
      
      if (typeof subcom.onaddstreamconnection === 'function') {
        subcom.onaddstreamconnection(connection);
      }
      
      subcom.handler('self:addstreamconnection', {
        stream: stream,
        connectionId: connectionId
      });
    };
    
    /**
     * Stops a stream connection.
     * @method removeStreamConnection
     * @param {String} connectionId The streaming connection id.
     * @for Self
     * @since 0.6.0
     */
    subcom.removeStreamConnection = function (connectionId) {
      var stream = subcom.streams[connectionId];
      
      stream.stop();
      
      // Do not remove main connection.
      // Stream may stop, but user is still connected.
      if (connectionId !== 'main') {
        // Stream has targeted users
        if (fn.isEmpty(subcom.streams[connectionId].targetUsers)) {
          fn.forEach(com.users, function (value, key) {
            value.removeConnection(streamId);
          });

        // Stream has targeted users
        } else {
          fn.forEach(subcom.streams[connectionId].targetUsers, function (value, key) {
            if (!fn.isEmpty(com.users[key])) {
              com.users[key].removeConnection(streamId);
            }
          });
        }
      }
  
      if (typeof subcom.onremovestreamconnection === 'function') {
        subcom.onremovestreamconnection(stream, targetUsers);
      }
      
      // Remove stream reference
      delete subcom.streams[streamId];
      // Remove connections to stream reference
      delete subcom.streams[streamId];
      
      subcom.handler('self:removestreamconnection', {
        streamId: streamId
      });
    };
    
    /**
     * Gets the self user info.
     * @method getInfo
     * @param {String} connectionId The connectionId of the stream.
     * @for Self
     * @since 0.6.0
     */
    subcom.getInfo = function (connectionId) {
      var info = {
        userData: subcom.data,
        agent: subcom.agent
      };
  
      if (fn.isEmpty(connectionId)) {
        var streaming = {};

        fn.forEach(subcom.streams, function (connection, key) {
          var settings = subcom.streams[connectionId] || {};
          var stream = settings.stream || { 
            config: { 
              audio: false, 
              video: false, 
              status: { audioMuted: true, videoMuted: true }
            } 
          };

          streaming[key] = {
            audio: stream.config.audio,
            video: stream.config.video,
            bandwidth: subcom.bandwidth,
            mediaStatus: stream.config.status
          };
        
        }, function () {
          info.settings = streaming;
          
          return info;
        });
      
      } else {
        var settings = subcom.streams[connectionId] || {};
        var stream = settings.stream || { 
          config: { 
            audio: false, 
            video: false, 
            status: { audioMuted: true, videoMuted: true }
          } 
        };
  
        info.settings = {
          audio: stream.config.audio,
          video: stream.config.video,
          bandwidth: subcom.bandwidth,
          mediaStatus: stream.config.status
        };
        
        return info;
      }
    };
    
    subcom.handler('self:start', config);
  }


  // Start loading the room information
  var path = '/api/' + globals.apiKey + '/' + com.name;

  // Set credentials if there is
  if (com.credentials !== null) {
    path += com.credentials.startDateTime + '/' +
      com.credentials.duration + '?&cred=' + com.credentials.hash;
  }

  // Check if there is a other query parameters or not
  if (globals.region) {
    path += (path.indexOf('?&') > -1 ? '&' : '?&') + 'rg=' + globals.region;
  }

  // Start connection
  Request.load(path, function (status, content) {
    // Store the path information
    com.apiPath = path;

    // Room configuration settings from server
    com.key = content.cid;
    com.id = content.room_key;
    com.token = content.roomCred;
    com.startDateTime = content.start;
    com.duration = content.len;
    com.owner = content.apiOwner;

    // User configuration settings from server
    com.self = new Self({
      id: null,
      username: content.username,
      token: content.userCred,
      timeStamp: content.timeStamp,
      data: globals.userData
    });
    
    //com.constraints = JSON.parse(content.pc_constraints);

    // Signalling information
    com.socket = new Socket({
      server: content.ipSigserver,
      httpPortList: content.httpPortList,
      httpsPortList: content.httpsPortList

    }, com.handler);
    
    // Bind the message events handler
    MessageHandler(com, listener);
    
    listener('room:start', {
      id: com.id,
      name: com.name
    });
  
  }, function (status, error) {
    com.handler('trigger:error', {
      error: error,
      state: -1
    });
  });
}