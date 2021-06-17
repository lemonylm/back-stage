import store from "@/store";
import Vue from "vue";

Vue.directive("permission", {
  inserted(el, binding) {
    if (
      !(
        store.getters.buttons.length &&
        store.getters.buttons.includes(binding.value)
      )
    ) {
      el.classList.add("permission-disabled");
      el.setAttribute("disabled", "disabled");
    }
  }
});
