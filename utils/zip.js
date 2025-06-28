const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a write stream for the zip file in the project root directory
const output = fs.createWriteStream(path.join(__dirname, '..', 'wake-the-nile.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// append files from a directory, putting its contents at the root of the archive
// These paths are relative to the project root, where the script is executed from.
archive.directory('css/', 'css');
archive.directory('js/', 'js');
archive.directory('includes/', 'includes');

// append a file
archive.file('wake-the-nile.php', { name: 'wake-the-nile.php' });

archive.finalize();
