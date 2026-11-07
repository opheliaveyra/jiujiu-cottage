// Original soundtrack and effects intentionally excluded from this adaptation.
export class Howl {
  constructor(){this._v=0;}
  play(){return 0;} playing(){return false;} stop(){return this;} pause(){return this;}
  fade(){return this;} mute(){return this;}
  volume(v){if(v!==undefined){this._v=v;return this;}return this._v;}
  once(){return this;} on(){return this;} off(){return this;}
}