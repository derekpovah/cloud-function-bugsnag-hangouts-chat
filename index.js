exports.bugsnag = (req, res) => {
  if (req.body.account.id === process.env.BUGSNAG_ACCOUNT_ID) {
    const request = require('request');
    const jbuilder = require('jbuilder');
    var bugsnagError = req.body.error;



    var messageBody = jbuilder.encode(function(json) {
      json.set('cards', function(json) {
        json.child(function(json) {
          json.set('header', function(json) {
            json.set('title', `${bugsnagError.exceptionClass} in ${bugsnagError.context}`);
            json.set('subtitle', bugsnagError.message);
          });

          json.set('sections', function(json) {
            json.child(function(json) {
              json.set('widgets', function(json) {
                json.child(function(json) {
                  json.set('buttons', function(json) {
                    json.child(function(json) {
                      json.set('textButton', function(json) {
                        json.set('text', 'VIEW ON BUGSNAG');
                        json.set('onClick', function(json) {
                          json.set('openLink', function(json) {
                            json.set('url', bugsnagError.url);
                          });
                        });
                      });
                    });

                    if (typeof bugsnagError.createdIssue != "undefined") {
                      json.child(function(json) {
                        json.set('textButton', function(json) {
                          json.set('text', `VIEW ON ${bugsnagError.createdIssue.type.toUpperCase()}`);
                          json.set('onClick', function(json) {
                            json.set('openLink', function(json) {
                              json.set('url', bugsnagError.createdIssue.url);
                            });
                          });
                        });
                      });
                    }
                  });
                });
              });
            });
          });
        });
      });
    });

    var options = {
      url: process.env.GOOGLE_CHAT_URL,
      body: messageBody,
      headers: {
        'content-type': 'application/json'
      }
    };

    request.post(options, function(error, response, body) {
      if(error) {
        res.status(500).send(error);
      } else {
        res.status(204).send();
      }
    });
  } else {
    res.status(402).send('Not authorized');
  }
};
