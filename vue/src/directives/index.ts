import { App, Directive } from "vue";
import {imgLazy} from "@/directives/modules/imgLazy";

const directivesList: { [key: string]: Directive } = {
  imgLazy
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      app.directive(key, directivesList[key]);
    });
  }
};

export default directives;
