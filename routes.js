var qMongo = require('./queries/mongo.js'),
  qNeo = require('./queries/neo.js');

module.exports = function (app) {

  // MongoDB routes
  app.get('/mongo/query/simple/1', function (req, res) {
    qMongo.simple1(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/mongo/query/simple/2', function (req, res) {
    qMongo.simple2(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/mongo/query/simple/3', function (req, res) {
    qMongo.simple3(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/mongo/query/simple/4', function (req, res) {
    qMongo.simple4(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/mongo/query/complex/1', function (req, res) {
    qMongo.complex1(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/mongo/query/complex/2', function (req, res) {
    qMongo.complex2(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/mongo/query/complex/3', function (req, res) {
    qMongo.complex3(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/mongo/query/complex/4', function (req, res) {
    qMongo.complex4(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  // Neo4J routes
  app.get('/neo/query/simple/1', function (req, res) {
    qNeo.simple1(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/neo/query/simple/2', function (req, res) {
    qNeo.simple2(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/neo/query/simple/3', function (req, res) {
    qNeo.simple3(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/neo/query/simple/4', function (req, res) {
    qNeo.simple4(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/neo/query/complex/1', function (req, res) {
    qNeo.complex1(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/neo/query/complex/2', function (req, res) {
    qNeo.complex2(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/neo/query/complex/3', function (req, res) {
    qNeo.complex3(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });

  app.get('/neo/query/complex/4', function (req, res) {
    qNeo.complex4(function (err, data) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
  });
};
