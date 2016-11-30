# Git Root Path
This npm module allows you to get the root path of a git repository. 
### Installation

```sh
$ npm install git-root-path
```

### Usage

```javascript
var gitRootPath = require("git-root-path");

// You can pass a folder name to find the root of the repository
var path = gitRootPath("/root/gitrepo/path/to/folder");
// /root/gitrepo

// If you don't pass any arguments then the current folder is taken
var path = gitRootPath();
```
