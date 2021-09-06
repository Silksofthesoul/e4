"use strict";

class Scene {
  id = null;
  class = null;
  width = null;
  height = null;
  element = null;
  inspect = null;
  matrixElements = [];
  inspectElements = [];
  matrix = [];
  context = {
    activeNeuron: null,
    statusElement: null,
    neurons: {}
  };

  constructor ({id, classElement, width, height, context}) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.context = {...this.context, ...context};
    this.createStyles();
    this.createMatrix();
    this.createUI();
    this.render();
    this.watcher()
  }

  createUI() {
    const uiBox = element('div', { class: "uiBox" });
    const groupDraw = element('div', { class: "uiBoxItem" });
    const groupRemember = element('div', { class: "uiBoxItem" });
    const groupTrain = element('div', { class: "uiBoxItem" });

    const cleanButton = element('button', {
      class: "cleanButton",
      text: 'clean',
      event: {
        type: 'click',
        handler: ({element, event}) => {
          this.matrix.forEach((item, i, arr) => arr[i] = 0);
        },
      }
    });

    const neuronSelector = element('select', {
      class: "neuronSelector",
      id: 'neuronSelector',
      event: {
        type: 'change',
        handler: ({element, event}) => {
          this.context.activeNeuron = element.value;
          this.context.neurons[this.context.activeNeuron].sensors
          .forEach((_, index) => {
            let el = this.inspectElements[index];
            clss({element: el, remove: 'zero'})
            clss({element: el, remove: 'one'})
            clss({element: el, remove: 'mOne'})
            stl(el, {'opacity': '1'})
          });
        }
      }
    });

    const rememberInput = element('input', {
      class: "rememberInput",
      id: 'rememberInput'
    });
    const rememberButton = element('button', {
      class: "rememberButton",
      text: 'remember',
      event: {
        type: 'click',
        handler: ({event}) => {
          let meaning = str(rememberInput.value).trim();
          if(meaning) {
            let neuron = new Neuro({ name: meaning, threshold: 8});
            if(!Object.keys(this.context.neurons).includes(neuron.name)) {
              const option = element('option', { value: neuron.name, text: neuron.name });
              insert(option, neuronSelector);
            }

            this.context.neurons[neuron.name] = neuron;
            this.context.neurons[neuron.name].setMeaning({meaning})
            this.context.neurons[neuron.name].initSensors({ sensors: this.matrix });
            this.context.neurons[neuron.name].log();

            if(len(Object.keys(this.context.neurons)) === 1 ) this.context.activeNeuron = neuron.name;

            rememberInput.value = '';
            // this.log();
          }
        },
      }
    });

    const recognizeButton = element('button', {
      class: "recognizeButton",
      text: 'recognize',
      event: {
        type: 'click',
        handler: ({element, event}) => {
          if(this.context.activeNeuron === null) return false;
          if(len(this.context.neurons) === 0) return false;
          const { activeNeuron } = this.context;

          this.context.neurons[activeNeuron]
          .setSensors({ sensors: this.matrix });

          let res = this.context.neurons[activeNeuron]
          .analiz({functType: 0});

          console.log('👓', res);
          if(res.status){
            clss({element: this.statusElement, add: 'true'})
            clss({element: this.statusElement, remove: 'false'})
          } else {
            clss({element: this.statusElement, add: 'false'})
            clss({element: this.statusElement, remove: 'true'})
          }
          // this.context.neurons[activeNeuron].log();
          // this.log();
        },
      }
    });
    const trainButton = element('button', {
      class: "trainButton",
      text: 'train',
      event: {
        type: 'click',
        handler: ({element, event}) => {
          if(this.context.activeNeuron === null) return false;
          if(len(this.context.neurons) === 0) return false;
          const { activeNeuron } = this.context;
          const testData = [
            co(this.matrix),
            co(this.matrix),
            co(this.matrix).map(item => item === 1 ? 0 : 1),
            ...co(this.matrix).map(item => this.matrix.map(rndCoinInt)),
          ];
          this.context.neurons[activeNeuron]
          .train({
            reference: this.matrix,
            testData,
            turns: 32,
            functType: 0
          });
          // this.context.neurons[activeNeuron].log();
        },
      }
    });
    const unTrainButton = element('button', {
      class: "unTrainButton",
      text: 'untrain',
      event: {
        type: 'click',
        handler: ({element, event}) => {
          if(this.context.activeNeuron === null) return false;
          if(len(this.context.neurons) === 0) return false;
          const { activeNeuron } = this.context;
          this.context.neurons[activeNeuron].untrain({ data: this.matrix });
        },
      }
    });
    const recognizeResult = element('div', { class: "recognizeResult", });
    this.statusElement = recognizeResult

    insert(cleanButton, groupDraw);

    insert(rememberInput, groupRemember);
    insert(rememberButton, groupRemember);

    insert(neuronSelector, groupTrain);
    insert(recognizeResult, groupTrain);
    insert(recognizeButton, groupTrain);
    insert(trainButton, groupTrain);
    insert(unTrainButton, groupTrain);

    insert(groupDraw, uiBox);
    insert(groupRemember, uiBox);
    insert(groupTrain, uiBox);

    insert(uiBox);
  }

  createStyles () {
    const style = `
      html, body, body * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        line-height: 1;
        font-size: 18px;
      }
      body * { font-size: 1rem; }
      body {
        display: grid;
        grid-template-areas: "header header" "scene inspect" "ui ui";
      }
      .uiBoxItem {
        margin-bottom: 1em;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
        align-content: baseline;
      }
      .rememberInput, .neuronSelector {
        padding: 0.5rem;
      }
      .cleanButton,
      .recognizeButton,
      .trainButton,
      .unTrainButton,
      .rememberButton {
        padding: 0.5rem;
        cursor: pointer;
      }
      .recognizeResult {
        transition: background 0.25s 0.25s ease-out;
        padding: 0.5rem;
        width: 2.1rem;
        min-height: 2.1rem;
        display: inline-block;
        outline: 1px dashed rgba(0, 0, 255, 0.1);
        background-color: rgba(255, 255, 255, 1);
      }
      .recognizeResult.false {
        background-color: rgba(128, 64, 64, 1);
      }
      .recognizeResult.true {
        background-color: rgba(64, 128, 64, 1);
      }
      .matrixInspect {
        transition: background 0.25s 0.25s ease-out, opacity 0.25s 0.25s ease-out;
        outline: 1px dashed rgba(0, 0, 255, 0.1);
        background-color: rgba(255, 255, 255, 1);
      }
      .matrixInspect.zero { background-color: rgba(255, 255, 255, 1); }
      .matrixInspect.one { background-color: rgba(255, 64, 64, 0.5); }
      .matrixInspect.mOne { background-color: rgba(64, 64, 255, 0.5); }
      .matrixElement {
        transition: background 0.25s 0.25s ease-out;
        outline: 1px dashed rgba(0, 0, 255, 0.1);
        background-color: rgba(255, 255, 255, 1);
      }
      .matrixElement.activated {
        background-color: rgba(255, 128, 96, 1);
      }
      .matrixElement:hover {
        transition: background 0.25s 0s ease-out;
        background-color: rgba(0, 0, 0, 0.3);
      }
      .matrixElement.activated:hover {
        background-color: rgb(121, 13, 2, 0.75);
      }

      .commonScene {
        display: grid;
        grid-area: scene;
        width: 48vw;
        max-height: 65vh;
        margin-left: 2vw;
        margin-top: 5vh;
        aspect-ratio: 1;
        outline: 1px solid rgba(255, 0, 0, 0.2);
        pointer-events: painted;
        cursor: pointer;
      }
      .inspect {
        display: grid;
        grid-area: inspect;
        width: 48vw;
        max-height: 65vh;
        margin-top: 5vh;
        aspect-ratio: 1;
        outline: 1px solid rgba(255, 0, 0, 0.2);
        pointer-events: painted;
        cursor: pointer;
      }
      .uiBox {
        grid-area: ui;
        margin-left: 2vw;
        margin-top: 2rem;
      }
    `
    .replace(/\s+/igm, ' ')
    .replace(/\n/igm, '');
    const el = element('style', {text: style});
    insert(el, document.head);
  }

  createMatrix () {
    const draw = index => {
      if(this.matrix[index] === 0) this.matrix[index] = 1;
      else this.matrix[index] = 0;
    };

    for (let index = 0; index < this.width * this.height; index++) {
      let elDraw = element('div', {
        class: 'matrixElement',
        // id: `id${index}`,
        events: [
          {
            type: 'mouseover',
            handler: ({ element, event }) => {
              const { buttons } = event;
              if(buttons === 1) draw(index);
            }
          }, {
            type: 'click',
            handler: ({ element, event }) => draw(index)
          }
        ]
      });
      let elInspect = element('div', { class: 'matrixInspect' });
      // addAttr(el, 'data-index', index);
      this.matrixElements.push(elDraw);
      this.inspectElements.push(elInspect);
      this.matrix.push(0);
    }
  }

  maxGreaterThanZero(sensors) {
    return sensors.reduce((sum, { weight }) => {
      if(weight > 0) {
        if(weight > sum) return weight;
        else return sum;
      }
      return sum;
    }, 0);
  }

  minLessThanZero(sensors) {
    return sensors.reduce((sum, { weight }) => {
      if(weight < 0) {
        if(weight < sum) return weight;
        else return sum;
      }
      return sum;
    }, 0);
  }

  watcher() {
    let timer = null;
    const self = this;
    const process = _ => {
      self.matrix.forEach((item, index) => {
        let element = self.matrixElements[index];
        if(item === 1) clss({element, add: 'activated'})
        else clss({element, remove: 'activated'})
      });

      if(self.context.activeNeuron !== null || len(self.context.neurons) !== 0) {
        const { activeNeuron } = self.context;
        const sensors = self.context.neurons[activeNeuron].sensors
        const maxGZ = self.maxGreaterThanZero(sensors);
        const minLZ = self.minLessThanZero(sensors);
        sensors.forEach(({weight}, index) => {
          let element = self.inspectElements[index];
          if(weight === 0) {
            clss({element, add: 'zero'});
            clss({element, remove: 'one'});
            clss({element, remove: 'mOne'});
          } else if(weight > 0) {
            let opacity = getPersentOfMax(weight,maxGZ) === 100 ? '1' : `0.${int(getPersentOfMax(weight,maxGZ))}`;
            clss({element, add: 'one'});
            clss({element, remove: 'zero'});
            clss({element, remove: 'mOne'});
            stl(element, {'opacity': str(opacity)})
          } else if(weight < 0) {
            let opacity = getPersentOfMax(abs(weight), abs(minLZ)) === 100 ? '1' : `0.${int(getPersentOfMax(abs(weight), abs(minLZ)))}`;
            clss({element, add: 'mOne'});
            clss({element, remove: 'zero'});
            clss({element, remove: 'one'});
            stl(element, {'opacity': str(opacity)})
          }
        });
      }
      timer = setTimeout(process, 100);
    };

    process();
  }

  render () {
    if(!this.element) {
      this.element = element('div', { class: 'commonScene', id: this.id, });
      stl(this.element, {
        'grid-template-columns': `repeat(${this.width}, 1fr)`,
        'grid-template-rows': `repeat(${this.width}, 1fr)`
      });
      insert(this.element);
    }
    if(!this.inspect) {
      this.inspect = element('div', { class: 'inspect', id: 'inspect', });
      stl(this.inspect, {
        'grid-template-columns': `repeat(${this.width}, 1fr)`,
        'grid-template-rows': `repeat(${this.width}, 1fr)`
      });
      insert(this.element);
      insert(this.inspect);
    }
    this.matrixElements.forEach(item => insert(item, this.element));
    this.inspectElements.forEach(item => insert(item, this.inspect));
  }
  getMatrix() {
    return this.matrix;
  }
  log () {
    console.log(this);
  }

};
