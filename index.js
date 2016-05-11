var Plugin    = require('broccoli-plugin');
var path      = require('path');
var fs        = require('fs');
var walkSync  = require('walk-sync');

StatsSyncPlugin.prototype = Object.create(Plugin.prototype);
StatsSyncPlugin.prototype.constructor = StatsSyncPlugin;

function StatsSyncPlugin(inputNodes, options) {
    options = options || {};
  
    Plugin.call(this, inputNodes, {
        annotation: options.annotation
    });
  
    this.options = options;
}

StatsSyncPlugin.prototype.build = function() {
    var srcDir = this.inputPaths[0];
    var outPath = this.outputPath;
    var totalSize = 0;
    
    var entries = walkSync(srcDir);

    for (var i = 0, l = entries.length; i < l; i++) {
        var relativePath = entries[i];
        
        var fileName = path.join( srcDir, relativePath );
        var fileStats = fs.statSync(fileName);
        totalSize += fileStats["size"];
    }

    var output = {"size":totalSize, "timestamp": Date.now()};

    fs.writeFileSync(path.join(this.outputPath, 'build.txt'), JSON.stringify(output));
};

module.exports = StatsSyncPlugin;