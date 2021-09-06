"use strict";

class Neuro {
  name = "unnamed";
  activateType = 0;
  threshold = 'auto';
  currentSum = 0;
  trainSet = 0;
  meaning = null;
  sensors = [];


  constructor ({ name, threshold, meaning}) {
    this.name = name;
    this.threshold = threshold;
    this.meaning = meaning || this.meaning;
  }

  setMeaning ({ meaning }) {
    this.meaning = meaning;
  }

  initSensors ({ sensors }) {
    this.sensors = sensors.map((value) => ({value, weight: rndMinMaxInt(-1, 1)}));
  }

  setSensors ({ sensors }) {
    this.sensors = sensors.map((value, index) => ({value, weight: this.sensors[index].weight}));
  }

  increase ( arr ) {
    this.sensors
    .forEach((_, i, s) => s[i].value === 1 ? s[i].weight += 1 : null);
    return this;
  }

  decrease ( arr ) {
    this.sensors
    .forEach((_, i, s) => s[i].value === 1 ? s[i].weight -= 1 : null);
    return this;
  }

  train ({ reference, testData, functType = 2, turns = 1 }) {
    for (let turn = 0; turn < turns; turn++) {
      testData.forEach((test) => {
        this.trainSet++;
        this.setSensors({sensors: test});
        if (!eqArr(test, reference)) {
          let res = this.analiz({functType})
          if (res.status) this.decrease(co(test));
        } else {
          let res = this.analiz({functType})
          if (!res.status) this.increase(co(test));
        }
      });
    }
  }
  untrain ({ data }) {
    this.decrease(co(data));
  }

  setActivateType ( num ) {
    if (isU(num)) this.activateType = 0;
    if (int(num) === 0) this.activateType = 0;
    else if (int(num) === 1) this.activateType = 1;
    else if (int(num) === 2) this.activateType = 2;
    else if (int(num) === 3) this.activateType = 3;
    else this.activateType = 0;
    return this;
  }

  activate ( sum, threshold ) {
    const f0 = s => s >= this.threshold;
    const f1 = (s, t) => 1 / (1 + exp(t > 0 ? -t : t * s));
    const f2 = (s, t) => (2 / (1 + exp(-(threshold) * sum))) - 1;
    const f3 = (s, t) => (1 - exp(-(threshold) * sum)) / (1 + exp(-(threshold) * sum));

    if (int(this.activateType) === 0) return f0(sum);
    else if (int(this.activateType) === 1) return f1(sum, threshold);
    else if (int(this.activateType) === 2) return f2(sum, threshold);
    else if (int(this.activateType) === 3) return f3(sum, threshold);
    else return f0(s);
  };

  analiz ({ functType = 2 }) {
    if (functType) this.setActivateType(functType);
    this.currentSum = this.sensors
    .reduce((sum, { value, weight }) => (sum + (value * weight)), 0);
    return {
      name: this.name,
      meaning: this.meaning,
      sum: this.currentSum,
      status: this.activate(this.currentSum, this.threshold)
    };
  };

  log () {
    console.log(this);
  }

};
