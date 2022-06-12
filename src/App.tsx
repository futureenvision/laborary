import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const _window: any = window;
let V86Starter: any = _window["V86Starter"];

function App() {
  let emulator: any;
  const [count, setCount] = useState(0);

  const createEmulator = () => {
    emulator = new V86Starter({
      wasm_path: "/src/build/v86.wasm",
      memory_size: 512 * 1024 * 1024,
      vga_memory_size: 8 * 1024 * 1024,
      screen_container: document.getElementById("screen_container"),
      bios: {
        url: "/src/bios/seabios.bin",
      },
      vga_bios: {
        url: "/src/bios/vgabios.bin",
      },
      filesystem: {
        baseurl: "/src/output/images/arch/",
        basefs: "/src/output/images/fs.json",
      },
      acpi: false,
      network_relay_url: "ws://localhost:8080/",
      autostart: true,
      bzimage_initrd_from_filesystem: true,
      cmdline: [
        "rw",
        "root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose",
      ].join(" "),
    });

    const save_file: any = document.getElementById("save_file");
    save_file.onclick = function () {
      emulator.save_state(function (error: any, new_state: BlobPart) {
        if (error) {
          throw error;
        }

        var a = document.createElement("a");
        a.download = "v86state.bin";
        a.href = window.URL.createObjectURL(new Blob([new_state]));
        a.dataset.downloadurl =
          "application/octet-stream:" + a.download + ":" + a.href;
        a.click();
      });

      this.blur();
    };

    const restore_file: any = document.getElementById("restore_file");
    restore_file.onchange = function () {
      if (this.files.length) {
        var filereader = new FileReader();
        emulator.stop();

        filereader.onload = (e: any) => {
          emulator.restore_state(e.target.result);
          emulator.run();
        };

        filereader.readAsArrayBuffer(this.files[0]);

        this.value = "";
      }

      this.blur();
    };
  };

  useEffect(() => {
    createEmulator();
  }, []);

  const save = (event: any) => {
    emulator.save_state((error: any, new_state: any) => {
      if (error) {
        throw error;
      }

      var a = document.createElement("a");
      a.download = "v86state.bin";
      a.href = window.URL.createObjectURL(new Blob([new_state]));
      a.dataset.downloadurl =
        "application/octet-stream:" + a.download + ":" + a.href;
      a.click();
    });
    event.blur();
  };

  const load = (event: any) => {
    event = event.nativeEvent;
    console.log(event);
    if (event.files.length) {
      var filereader = new FileReader();
      emulator.stop();

      filereader.onload = (e: any) => {
        emulator.restore_state(e.target.result);
        emulator.run();
      };

      filereader.readAsArrayBuffer(event.files[0]);

      event.value = "";
    }

    event.blur();
  };

  return (
    <div className="App">
      <div className="header">Future Envision</div>
      <div id="screen_container">
        <div></div>
        <canvas></canvas>
      </div>
      <div className="tools">
        <div className="tool">
          <p>Save State</p>
          <p>
            <input id="save_file" type="button" value="Save State" />{" "}
          </p>
        </div>
        <div className="tool">
          {" "}
          <p>Load State</p>
          <p>
            <input id="restore_file" type="file" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
