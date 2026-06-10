(function(Scratch) {
  'use strict';

  class WebToExe {
    constructor() {
      this.dataRecibido = "";
      this.conectarWebSocket();
    }

    conectarWebSocket() {
      // Nos conectamos al servidor que abrirá nuestro script en segundo plano
      const ws = new WebSocket('ws://localhost:8080');

      ws.onmessage = (e) => {
        this.dataRecibido = e.data;
        // Activamos el bloque HAT de PenguinMod
        if (Scratch.vm && Scratch.vm.runtime) {
          Scratch.vm.runtime.startHats('webtoexe_alRecibirDato');
        }
      };

      ws.onclose = () => {
        // Si se desconecta, intenta volver a conectar cada 3 segundos
        setTimeout(() => this.conectarWebSocket(), 3000);
      };

      ws.onerror = () => {
        // Evita que los errores saturen la consola si el .bat aún no está abierto
      };
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
      // Llama al protocolo personalizado de Windows
      window.location.href = `felauncher://${args.DATA}`;
    }

    alRecibirDato() {
      return false;
    }

    datosRecibidos() {
      return this.dataRecibido;
    }
  }

  Scratch.extensions.register(new WebToExe());
})(Scratch);
