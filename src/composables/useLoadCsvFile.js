import { reactive, toRefs } from "vue";
import Papa from "papaparse";

export default function useLoadCsvFile() {
  const data = reactive({ stores: [], isDataLoaded: false });
  const loadCsv = async (event, csvFile) => {
    const parseFile = (csvFile) =>
      new Promise((resolve, reject) => {
        Papa.parse(csvFile[0], {
          header: true,
          complete: function ({ data }) {
            resolve(data);
          },
          error: function (error) {
            reject(error);
          },
        });
      });
    const stores = await parseFile(csvFile);

    data.stores = stores;
    data.isDataLoaded = true;
  };
  return { ...toRefs(data), loadCsv };
}
