<template>
  <main>
    <form v-if="!isDataLoaded" enctype="multipart/form-data">
      <input
        name="csvFile"
        style="display: none;"
        @change.prevent="loadCsv($event, $event.target.files)"
        type="file"
        id="csvFile"
        accept=".csv"
        ref="fileInput"
      />
      <button @click.prevent="$refs.fileInput.click()">Select CSV file</button>
    </form>
    <form v-if="isDataLoaded" class="closest-store">
      <div>
        <label for="location">Address/Zip </label>
        <input id="location" type="text" v-model="location" />
      </div>
      <div>
        <label class="unit" for="unit">Units</label>
        <select id="units" v-model="unit">
          <option value="mile">mi</option>
          <option value="km">km</option>
        </select>
      </div>
      <div>
        <button @click.prevent="findClosestStore(data, location, unit)">
          Find Closest Store
        </button>
      </div>
    </form>
    <div class="result">
      <div v-if="loading">
        Loading...
      </div>
      <div v-else-if="error" class="error">
        {{ result }}
      </div>
      <div v-else>
        {{ result }}
      </div>
    </div>
  </main>
</template>

<script>
import useLoadCsvFile from "../composables/useLoadCsvFile";
import useFindStore from "../composables/useFindStore";

export default {
  data() {
    return {
      location: "",
      unit: "mile",
    };
  },
  setup() {
    const { data, isDataLoaded, loadCsv } = useLoadCsvFile();
    const { result, error, loading, findClosestStore } = useFindStore();
    return {
      isDataLoaded,
      data,
      loadCsv,
      result,
      error,
      loading,
      findClosestStore,
    };
  },
};
</script>

<style scoped>
main {
  margin-top: 100px;
  text-align: center;
}

.closest-store {
  width: 70%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

input[type="text"] {
  width: 400px;
}

label {
  margin-bottom: 0px;
  margin-right: 5px;
}

.result {
  width: 70%;
  margin: 10px auto 0px auto;
  text-align: left;
}

.error {
  color: red;
}
</style>
