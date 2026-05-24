(function(Scratch) {
    'use strict';

    class DirectFileExtension {

        getInfo() {
            return {
                id: 'directfile',
                name: 'Direct File',
                color1: '#0083FF',
                color2: '#1123BF',

                blocks: [

                    {
                        opcode: 'saveFile',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Save [TEXT] in file [FILE]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "value"
                            },
                            FILE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "file.txt"
                            }
                        }
                    },

                    {
                        opcode: 'readFile',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Read file [FILE]',
                        arguments: {
                            FILE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "file.txt"
                            }
                        }
                    }

                ]
            };
        }

        saveFile(args) {

            const fs = require('fs');
            const path = require('path');

            const parentFolder = path.dirname(__dirname);
            const filePath = path.join(parentFolder, args.FILE);

            try {
                fs.writeFileSync(filePath, args.TEXT, 'utf8');
                console.log("Archivo guardado:", filePath);
            } catch (err) {
                console.error("Error guardando archivo:", err);
            }
        }

        readFile(args) {

            const fs = require('fs');
            const path = require('path');

            const parentFolder = path.dirname(__dirname);
            const filePath = path.join(parentFolder, args.FILE);

            try {

                if (fs.existsSync(filePath)) {

                    const data = fs.readFileSync(filePath, 'utf8');
                    console.log("Archivo leído:", filePath);

                    return data;

                } else {

                    console.warn("Archivo no existe:", filePath);
                    return "";

                }

            } catch (err) {

                console.error("Error leyendo archivo:", err);
                return "";

            }
        }

    }

    Scratch.extensions.register(new DirectFileExtension());

})(Scratch);
