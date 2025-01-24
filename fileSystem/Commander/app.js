const { Buffer } = require("buffer");
const fs = require("fs/promises");
// import * as fs from "fs/promises";  // changes the extension from app.js to app.mjs

(async () => {
    //   commands
    const COMMANDS = {
        CREATE_FILE: "create a file",
        DELETE_FILE: "delete the file",
        RENAME_FILE: "rename the file",
        ADD_TO_FILE: "add to the file",
    };

    /*  const createFile = async path => {
      try {
        const existingFileHandle = await fs.open(path, "r");
        console.log(`The file ${path} already exists`);
        existingFileHandle.close();
      } catch (e) {
        const newFileHandle = await fs.open(path, "w");
        console.log(`A new file was created successfully`);
        newFileHandle.close();
      }
    }; */

    const createFile = async path => {
        try {
            const newFileHandle = await fs.open(path, "wx");
            console.log(`A new file was created successfully`);
            newFileHandle.close();
        } catch (e) {
            console.log(`Failed to create file ${path}, ${e.message}`);
        }
    };
    const deleteFile = async path => {
        try {
            const existingFileHandle = await fs.open(path, "r");
            await existingFileHandle.close();
            await fs.unlink(path); // rm is extremely powerful might even corrupt whole hard drive by mistake
            console.log("Deleted file: " + path);
        } catch (e) {
            console.log("File does not exist: " + path, e.message);
        }
    };

    const renameFile = async (oldPathName, newPathName) => {
        try {
            const existingFileHandle = await fs.open(oldPathName, "r");
            await existingFileHandle.close();
            await fs.rename(oldPathName, newPathName); // with this rename function, one can move files too.
            console.log(`Renamed ${oldPathName} to ${newPathName}`);
        } catch (e) {
            console.log("Failed to rename: " + e.message);
        }
    };

    const addToFile = async (path, content) => {
        try {
            await fs.appendFile(path, content);
            console.log(`Added "${content}" to ${path}`);
        } catch (e) {
            console.log(`Failed to add content to the file: ${e.message}`);
        }
    };

    const commandFileHandler = await fs.open("./command.txt", "r");

    commandFileHandler.on("change", async () => {
        const size = (await commandFileHandler.stat()).size;
        const buffer = Buffer.alloc(size);
        const options = {
            size,
            buffer,
            offset: 0,
            position: 0,
            length: buffer.byteLength,
        };

        await commandFileHandler.read(options); // This will populate the exisiting buffer

        if (buffer.length) {
            const command = buffer.toString("utf-8");

            // create a file:
            // create a file <path>
            if (command.includes(COMMANDS.CREATE_FILE)) {
                const filePath = command.substring(COMMANDS.CREATE_FILE.length + 1);
                createFile(filePath);
            }

            //   delete a file
            //   delete the file <path>
            if (command.includes(COMMANDS.DELETE_FILE)) {
                const filePath = command.substring(COMMANDS.DELETE_FILE.length + 1);
                deleteFile(filePath);
            }

            //   rename file
            //   rename the file <path> to <new-path>
            if (command.includes(COMMANDS.RENAME_FILE)) {
                const _idx = command.indexOf(" to ");
                const oldFilePath = command.substring(
                    COMMANDS.RENAME_FILE.length + 1,
                    _idx
                );
                const newFilePath = command.substring(_idx + " to ".length);
                renameFile(oldFilePath, newFilePath);
            }

            //   add to file:
            //   add to the file <path> this content: <content>
            if (command.includes(COMMANDS.ADD_TO_FILE)) {
                const _idx = command.indexOf(" this content: ");
                const filePath = command.substring(
                    COMMANDS.ADD_TO_FILE.length + 1,
                    _idx
                );

                const content = command.substring(_idx + " this content: ".length);

                addToFile(filePath, content);
            }
        }
    });

    const watcher = fs.watch("./command.txt");

    for await (const event of watcher) {
        commandFileHandler.emit(event.eventType);
    }
})();
