var path = require("path");
var fs = require("fs");
function checkDirectorySync(directory) {
    var err;  
    try {
        fs.statSync(directory);
    } catch(e) {
        err=e;
    }
    return (err===undefined)?true:false;
}

function get_project_root(directory){
    directory=directory||path.resolve(".");
    if(!checkDirectorySync(directory)){
        throw "Path is invalid";
    }
    if(checkDirectorySync(path.resolve(directory,".git"))){
        return directory;
    }else{
        var parent=path.resolve(directory,"..");
        if(parent===directory){
            throw "You must be inside a git repository";
        }
        return get_project_root(parent);
    }
}

module.exports=get_project_root;