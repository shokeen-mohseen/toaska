import { Pipe, PipeTransform } from '@angular/core';
import { AmnioticMouldingList } from '@app/core/models/d3chart/d3.chart.modal.popup';

@Pipe({
  name: 'transformPartograph'
})
export class TransformPartographPipe implements PipeTransform {

  transform(value: string, ...mode: string[]): string {
   
    let pipevalue = null;
    
    if (mode[0] == "AMF") {
      if (value == "-") {
        value = "I";
      }
      let arrayList: any[] = AmnioticMouldingList.amnioticData;
      for (let i = 0; i < arrayList.length; i++) {

        if (value == arrayList[i].Amid) {
          pipevalue = arrayList[i].AmName
        }
      }

    }


    return pipevalue;
  }

}
