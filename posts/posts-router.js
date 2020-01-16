const express = require("express");
const Posts = require("../data/db");
const router = express.Router();

// /api/posts GET
router.get("/", (req, res) => {
  Posts.find() // return a promise
    .then(posts => {
      console.log("Posts", posts);
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The Posts information could not be retrieved."
      });
    });
});

// /api/posts/:id post by specific ID

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
          console.log('POSTED')
        res.status(200).json(post);
      } else {
          console.log('Not Posted')
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The posts infromation could not be retrieved"
      });
    });
});

// /api/posts/:id/comments comment of specific post by ID

router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then(comment => {
      if (!comment) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        res.status(200).json(comment);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});

//POST requests

//POST request to /api/posts Creating a new post
router.post("/", (req, res) => {
  const { title, contents } = req.body;
  console.log(req.body);
  if (!title || !contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json({
          message: `Post ${title} with the contents ${contents} was added to the database.`
        });
      })
      .catch(error => {
        console.log("POST error", error);
        res.status(500).json({
          error: "There was an error while saving the post to the database."
        });
      });
  }
});
// POST request for /api/posts/:id/comments creating a new comment for a post

router.post("/:id/comments", (req, res) => {
  const { text } = req.body;
  Posts.findById(req.params.id).then(post => {
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else if (!text) {
      res.status(400).json({
        errorMessage: "Please provide text for the comment."
      });
    } else {
      Posts.insertComment(req.body)
        .then(post => {
          res.status(201).json({
            message: `Object was created`,
            newComment: {...req.body, id: post.id}
          });
        })
        .catch(error => {
          console.log(`POST failed`, error);
          res.status(500).json({
            error: "There was am error while saving the comment to the database"
          });
        });
    }
  });
});
// DELETE requests

// api/posts/:id

router.delete("/:id", (req, res) => {
  Posts.findById(req.params.id).then(post => {
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else {
      Posts.remove(req.params.id).then(response => {
        res
          .status(200)
          .json({
            success: true,
            deleted: response
          })
          .catch(error => {
            console.log("DELETE failed", error);
            res.status(500).json({
              error: "The post could not be removed"
            });
          });
      });
    }
  });
});

//PUT requests

// api/posts/:id

router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      error: "Name or Bio are missing for the user"
    });
  } else {
    Posts.update(req.params.id, req.body)
      .then(post => {
        if (post) {
          res.status(200).json({
            message: `post updated`
          });
        } else {
          res.status(404).json({
            message: "The Post with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        console.log(`PUT failed`, error);
        res.status(500).json({
          error: "Ther Post Infromation couldn't be modified."
        });
      });
  }
});
module.exports = router;
