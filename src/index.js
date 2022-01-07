"use strict";

import "./styles.css";
import Vue from 'vue/dist/vue.esm.js'

new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello World',
      productsData: {},
      estimateItems: [],
      categorySelected : []
    }
  },
  computed: {
    selectProduct(id) {
      return (id) => {
        const catId = this.productsData.products.categories.find(o => o.id === id)
        // console.log(catId)
        const filteredItems = this.productsData.items.filter(o => o.category === catId.id)
        return filteredItems
      }
    }
  },
  watch: {
    categorySelected: {
      handler(newValue,oldValue) {
        const catId = this.productsData.products.categories.find(o => o.id === newValue)
        // console.log(catId)
      },
      deep: true
    },
    estimateItems: {
      handler(newValue,oldValue) {
        newValue.filter((p, i) => {
          return Object.keys(p).some((prop) => {
            const diff = p[prop] === this.estimateItems[i].itemName
            if(diff && this.estimateItems[i].itemName) {
              const item = this.productsData.items.find(o => o.itemName === this.estimateItems[i][prop])
              console.log(item)
              this.estimateItems[i].price = item.price
              this.estimateItems[i].unit = item.unit
              this.estimateItems[i].vat = item.vat
            }
          })
        })
      },
      deep: true
    }
  },
  methods: {
    async initData() {
      await fetch('./products.json',{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          this.productsData = data
        })
        .catch((reason) => {
            console.error(reason)
        });
    },
    initItem() {
      this.estimateItems.push({
        categoryId: '',
        itemName: '',
        price: '',
        volume: '',
        unit: '',
        vat: ''
      })
      const firstCategoryId = this.productsData.products.categories[0].id
      this.categorySelected.push(firstCategoryId)
      const firstItem = this.productsData.items.find(o => o.category === firstCategoryId)
      this.estimateItems[0].categoryId = firstItem.category
      this.estimateItems[0].itemName = firstItem.itemName
      this.estimateItems[0].price = firstItem.price
      this.estimateItems[0].unit = firstItem.unit
      this.estimateItems[0].vat = firstItem.vat
    }
  },
  async mounted() {
    await this.initData()
    this.initItem()
  }
})