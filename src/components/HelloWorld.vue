<template>
  <div class="hello">
    <div id="buttonGroup" :class="{'field':true,
     'is-grouped':true,
     'is-grouped-centered':true,
      'center':launches.length == 0,
      'animate__animated': true
    }">
      <p class="control">
        <el-select multiple
                   v-model="dSelect"
                   placeholder="Select"
                   @remove-tag="mReset()"
        >
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
      </p>
      <p class="control animate__animated animate__pulse animate__infinite">
        <button class="button is-danger" @click="mFetch">Launch</button>
      </p>
    </div>
    <table id="launchTable" class="table animate__backInUp animate__animated" v-if="launches.length > 0">
      <thead>
      <tr>
        <th v-for="header in dSelect">
          {{ mNormilizeHeader(header) }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in launches">
        <td v-for="index in dSelect">
          <span v-if="mIsImage(index)">
            <figure class="image is-128x128" v-for="img in mGetItem(item, index)">
              <img :src="img">
            </figure>
          </span>
          <span v-else>
            {{ mGetItem(item, index) }}
          </span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.center {
  align-items: center;
  height: 40vw;
}
</style>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      dAnimateIn: true,
      launches: [],
      dSelect: '',
      options: [
        {label: 'launch site', value: 'launch_site.site_name_long'},
        {label: 'details', value: 'details'},
        {label: 'images', value: 'links.flickr_images'},
        {label: 'mission name', value: 'mission_name'},
        {label: 'launch year', value: 'launch_year'},
        {label: 'launch success', value: 'launch_success'},
      ]
    }
  },
  methods: {
    mReset() {
      let vm = this;
      const element = document.querySelector('#launchTable');
      element.classList.remove('animate__backInUp');
      element.classList.add('animate__bounceOutLeft');

      element.addEventListener('animationend', () => {
        vm.launches = [];
        element.classList.remove('animate__backInUp');
        element.classList.add('animate__bounceOutLeft');
      });
    },
    mNormilizeHeader(header) {
      return header.replace('.', ' ').replace('_', ' ')
    },
    mIsImage(index) {
      return index.includes('flickr_images')
    },
    mGetItem(item, index) {
      if (!index.includes('.')) {
        return item[index]
      }
      let toReturn = item;
      index.split('.').forEach((item, key) => {
        toReturn = toReturn[item];
      })
      return toReturn

    },
    mFetch() {
      let vm = this;
      let dataToSend = this.dSelect.map((item) => {
        if (item.includes('.')) {
          //outer element
          let toReturn = item.split('.')[0];
          toReturn += '{' + item.split('.')[1] + '}';
          return toReturn
        }
        return item
      })
      console.log(dataToSend);
      let query = `
      {
        launches(find: {mission_name: "Starlink*"}) {
          ${dataToSend}
        }
      }
      `
      console.log(query);
      axios.post('https://api.spacex.land/graphql/', {
        query: query
      })
          .then(res => {
            const element = document.querySelector('#buttonGroup');
            element.classList.add('animate__bounceOutLeft');

            element.addEventListener('animationend', () => {

              const element = document.querySelector('#buttonGroup');
              element.classList.remove('animate__bounceOutLeft');
              element.classList.add('animate__bounceInLeft');
                vm.launches = res.data.data.launches

              element.addEventListener('animationend', () => {
                element.classList.remove('animate__bounceOutLeft');
              });
            });
          })
    }
  }
}
</script>
