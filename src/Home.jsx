import { useEffect, useState } from "react";
import "./home.scss";
import Dropzone from "./components/dropzone/Dropzone";
import calcBADValues from "./BAD_alhorithm";
import throttling from "./utils/throttling";

const Home = () => {
  const [file, setFile] = useState(undefined);
  const [data, setData] = useState(undefined);
  const [calcValues, setCalcValues] = useState(undefined);
  const [decompress, setDecompress] = useState(false);
  const [calc, setCalc] = useState(false);

  const handleUpload = (file) => {
    setFile(file);
  };

  useEffect(() => {
    if (!file) return;
    const fName = file.name;
    const extension = fName.slice(fName.lastIndexOf('.') + 1);
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = async () => {
      const bufferData = reader.result;
      if (!bufferData) return

      if (extension === "txt") {
        setCalc(true);
        await throttling(50);
        const data = convertToNumbArr(bufferData);
        setData(data);

        setCalc(false);
        await throttling(50);
        return;
      }
      setDecompress(true);
      await throttling(50);

      const uint8Buffer = new Uint8Array(bufferData);
      // eslint-disable-next-line
      const unzipData = bzip2.simple(bzip2.array(uint8Buffer));
      setDecompress(false);
      await throttling(50);

      setCalc(true);
      await throttling(50);
      const data = convertToNumbArr(unzipData);
      setData(data);

      setCalc(false);
      await throttling(50);
    };

    if (extension === "bz2") {
      reader.readAsArrayBuffer(file);
    } else if (extension === "txt") {
      reader.readAsText(file);
    } else {
      alert(`Extension: '.${extension}' doesn't support, use .txt or .bz2`);
    }
  }, [file]);

  useEffect(() => {
    if (!data) return;
    
    const values = calcBADValues(data);
    console.log(values);
    setCalcValues(values);
  }, [data]);

  function convertToNumbArr (bufferData) {
    const cloneD = bufferData; //string and other primitive copy;
    const regex = /[\n\r\t]+/g;
    const strArr = cloneD.replace(regex, " ");

    if (strArr.length === 0) {
      alert('empty file');
      return;
    }
    const numbArr = strArr.split(" ").map((elem) => {
      const elemToNumb = +elem;

      if (isNaN(elemToNumb)) {
        alert(`expect list of number, but get ${elem}`);
        throw new Error(`expect list of number, but get ${elem}`);
      }
      return elemToNumb;
    });

    return numbArr;
  }

  const showBADValues = (calcValues) ? 
    <div className="show">
      <div className="show__item">
        <div className="show__title">Максимальне число в файлі: </div>
        <div className="show__value">{calcValues.maxValue}</div>
      </div>
      <div className="show__item">
        <div className="show__title">Мінімальне число в файлі: </div>
        <div className="show__value">{calcValues.minValue}</div>
      </div>
      <div className="show__item">
        <div className="show__title">Медіана: </div>
        <div className="show__value">{calcValues.medianValue}</div>
      </div>
      <div className="show__item">
        <div className="show__title">Середнє арифметичне значення: </div>
        <div className="show__value">{calcValues.arithmeticMean}</div>
      </div>
      <div className="show__item">
        <div className="show__title">Найбільша послідовність чисел, яка збільшується: </div>
        <div className="show__value">{createList(calcValues.maxAscendingSequence)}</div>
      </div>
      <div className="show__item">
        <div className="show__title">Найбільша послідовність чисел, яка зменьшується: </div>
        <div className="show__value">{createList(calcValues.maxDescendingSequence)}</div>
      </div>
    </div> 
    : null;

  function createList(arr) {
    return arr.map((elem, i) => <span style={{padding: '0 6px'}} key={i}>{" "}{elem}{" "}</span>)
  }

  return (
    <section className="home">
      <div className="home__container">
        <div className="home__header">
          <h1>Hello, PortaOne</h1>
        </div>
          <Dropzone onUpload={handleUpload} />
        {decompress && <div className="home__userMessage">Розпакування архіву, будь ласка, почекайте, на процессорі intel core i7-9750H у браузері Google Chrome це займає 50 секунд</div>}
        {calc && <div className="home__userMessage">Розрахунок значень, будь ласка, почекайте, на процессорі intel core i7-9750H у браузері Google Chrome це займає 20 секунд</div>}
        {showBADValues}
      </div>
    </section>
  );
};
export default Home;
