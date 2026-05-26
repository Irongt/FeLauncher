(function(Scratch) {
  'use strict';

  class WebToExe {
    constructor() {
      this.dataRecibido = "";
      // Listen for the custom event sent from Electron
      window.addEventListener('token-recibido', (e) => {
        this.dataRecibido = e.detail;
        // Trigger the hat block
        Scratch.vm.runtime.startHats('webtoexe_alRecibirDato');
      });
    }

    getInfo() {
      return {
        id: 'webtoexe',
        name: 'Web-to-EXE',
        blocks: [
          {
            opcode: 'abrirPrograma',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Open FeLauncher with data [DATA]',
            arguments: {
              DATA: { type: Scratch.ArgumentType.STRING, defaultValue: 'ID_ENCRIPTADO' }
            }
          },
          {
            opcode: 'alRecibirDato',
            blockType: Scratch.BlockType.HAT,
            text: 'When the data is received'
          },
          {
            opcode: 'datosRecibidos',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Data received'
          }
        ]
      };
    }

    abrirPrograma(args) {
      // Trigger the system protocol
      window.location.href = `felauncher://${args.DATA}`;
    }

    alRecibirDato() {
      // Hat blocks do not require logic here
      return false;
    }

    datosRecibidos() {
      return this.dataRecibido;
    }
  }

  // Register the class correctly
  Scratch.extensions.register(new WebToExe());
})(Scratch);
