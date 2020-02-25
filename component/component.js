/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import NodeDriver from 'shared/mixins/node-driver';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed = Ember.computed;
const get = Ember.get;
const set = Ember.set;
const alias = Ember.computed.alias;
const service = Ember.inject.service;
const observer = Ember.observer;
const hash = Ember.RSVP.hash;

const defaultRadix = 10;
const defaultBase = 1024;
/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/

const regionMap = {
  'Mumbai':    'ap-mumbai-1',
  'Seoul':     'ap-seoul-1',
  'Tokyo':     'ap-tokyo-1',
  'Toronto':   'ca-toronto-1',
  'Frankfurt': 'eu-frankfurt-1',
  'Zurich':    'eu-zurich-1',
  'Sao Paolo': 'sa-saopaulo-1',
  'London':    'uk-london-1',
  'Ashburn':   'us-ashburn-1',
  'Phoenix':   'us-phoenix-1',
}

const nodeShapeMap = {
  'VM.Standard1.1':    'VM.Standard1.1',
  'VM.Standard1.2':    'VM.Standard1.2',
  'VM.Standard1.4':    'VM.Standard1.4',
  'VM.Standard1.8':    'VM.Standard1.8',
  'VM.Standard1.16':   'VM.Standard1.16',
  'VM.Standard2.1':    'VM.Standard2.1',
  'VM.Standard2.2':    'VM.Standard2.2',
  'VM.Standard2.4':    'VM.Standard2.4',
  'VM.Standard2.8':    'VM.Standard2.8',
  'VM.Standard2.16':   'VM.Standard2.16',
  'VM.Standard2.24':   'VM.Standard2.24',
  'BM.Standard.E2.64': 'BM.Standard.E2.64',
  'BM.Standard2.52':   'BM.Standard2.52',
  'BM.Standard.B1.44': 'BM.Standard.B1.44',
  'BM.DenseIO2.52':    'BM.DenseIO2.52',
  'BM.HPC2.36':        'BM.HPC2.36',
  'VM.Standard.E2.1.Micro':  'VM.Standard.E2.1.Micro',
  'VM.Standard.E2.2':  'VM.Standard.E2.2',
  'VM.GPU2.1':         'VM.GPU2.1',
  'VM.GPU2.2':         'VM.GPU2.2',
  'VM.GPU3.1':         'VM.GPU3.1',
  'VM.GPU3.2':         'VM.GPU3.2',
  'VM.GPU3.4':         'VM.GPU3.4',
  'VM.GPU3.4':         'VM.GPU3.8',
}

const imageMap = {
  'Oracle-Linux-7.7': 'Oracle-Linux-7.7',
}

export default Ember.Component.extend(NodeDriver, {
  driverName: '%%DRIVERNAME%%',
  step: 1,
  config: alias('model.%%DRIVERNAME%%Config'),
  app: service(),
  intl: service(),
  init() {
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'nodes/components/driver-%%DRIVERNAME%%/template'
    });

    set(this, 'layout', template);

    this._super(...arguments);

  },
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/
  // Write your component here, starting with setting 'model' to a machine with your config populated
  bootstrap: function () {
    // bootstrap is called by rancher ui on 'init', you're better off doing your setup here rather then the init function to ensure everything is setup correctly
    let config = get(this, 'globalStore').createRecord({
      type: '%%DRIVERNAME%%Config',
      instanceType: 'VM.Standard2.1',
      region:            'us-phoenix-1',
      nodeImage: 'Oracle-Linux-7.7',
      uaPrefix: 'Rancher',
      tags: '',
      authorizedUsers: '',
      createPrivateIp: true,
      stackscript: '',
      stackscriptData: '',
      rootPass: null,
      privateKeyPassphrase: null,
    });

    set(this, 'model.%%DRIVERNAME%%Config', config);
  },

  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();
    var errors = get(this, 'errors') || [];
    if (!get(this, 'model.name')) {
      errors.push('Name is required');
    }

    if (!this.get('model.%%DRIVERNAME%%Config.instanceType')) {
      errors.push('Specifying a %%DRIVERNAME%% Instance Type is required');
    }

    if (!this.get('model.%%DRIVERNAME%%Config.nodeImage')) {
      errors.push('Specifying a %%DRIVERNAME%% Image is required');
    }

    if (!this.get('model.%%DRIVERNAME%%Config.region')) {
      errors.push('Specifying a %%DRIVERNAME%% Region is required');
    }

//    if (!this.validateCloudCredentials()) {
//      errors.push(this.intl.t('nodeDriver.cloudCredentialError'));
//    }

    // Set the array of errors for display,
    // and return true if saving should continue.
    if (get(errors, 'length')) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },
  // Any computed properties or custom logic can go here
  actions: {
    finishAndSelectCloudCredential(credential) {
      set(this, 'model.cloudCredentialId', get(credential, 'id'))
    }
  },
  regionChoices: Object.entries(regionMap).map((e) => ({
    label: e[0],
    value: e[1]
  })),
  selectedRegion: computed('model.%%DRIVERNAME%%Config.region', function() {
    const region = get(this, 'model.%%DRIVERNAME%%Config.region');

    return region;
  }),
  adChoices: computed('model.%%DRIVERNAME%%Config.region', function() {
    // TODO get these values dynamically
    let values = {
      "AD1": "jGnV:" + get(this, 'model.%%DRIVERNAME%%Config.region').toUpperCase().replace('-1', '').replace('US-PHOENIX', 'PHX') + "-AD-1",
      "AD2": "jGnV:" + get(this, 'model.%%DRIVERNAME%%Config.region').toUpperCase().replace('-1', '').replace('US-PHOENIX', 'PHX') + "-AD-2",
      "AD3": "jGnV:" + get(this, 'model.%%DRIVERNAME%%Config.region').toUpperCase().replace('-1', '').replace('US-PHOENIX', 'PHX') + "-AD-3",
      };
      
      // get the keys
      let keys = Object.keys(values);
      // map the values into want you want
      let result = keys.map(key => {
        //return {label:values[key], value:key}
        return {label:values[key], value:values[key]}
      })
      return result
  }),
  selectedAd: computed('model.%%DRIVERNAME%%Config.nodeAvailabilityDomain', function() {
    const ad = get(this, 'model.%%DRIVERNAME%%Config.nodeAvailabilityDomain');

    return ad;
  }),
  nodeShapeChoices: Object.entries(nodeShapeMap).map((e) => ({
    label: e[1],
    value: e[0]
  })),
  selectednodeShape: computed('model.%%DRIVERNAME%%Config.nodeShape', function() {
    const nodeShape = get(this, 'model.%%DRIVERNAME%%Config.nodeShape');

    return nodeShape && nodeShapeMap[nodeShape];
  }),
  imageChoices: Object.entries(imageMap).map((e) => ({
    label: e[1],
    value: e[0]
  })),
  selectedImage: computed('model.%%DRIVERNAME%%Config.nodeImage', function() {
    const nodeImage = get(this, 'model.%%DRIVERNAME%%Config.nodeImage');

    return nodeImage && imageMap[nodeImage];
  }),
});