class CSV {
  static convert(text, opt = {}) {
    opt.sep = opt.sep || ";";
    let allTextLines = text.split(new RegExp("\n"));

    return allTextLines.map(line => {
      return line.split(opt.sep).map(cell => {
        let result = cell.trim();
        if (/^".*"$/.test(result)) result = result.replace(/^"|"$/g, "");
        return result;
      });
    });
  }

  constructor(path) {
    this._path = path;
  }

  read(callback, opt = {}) {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", this._path, false);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status === 0)) {
        typeof callback === "function" && callback(CSV.convert(rawFile.responseText, opt));
      }
    };
    rawFile.send(null);
    return this;
  }
}

export default CSV;
