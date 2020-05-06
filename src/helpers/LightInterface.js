class LightInterface {
  constructor(deviceType) {
    this.deviceType = deviceType;
  }

  get lightInfomation() {
    if (!this.authenticated) {
      return false;
    }
    switch (this.deviceType) {
      case 'nanoleaf':
        return this.axiosClient.get('').then((response) => response.data).catch((err) => {
          console.log(err);
        });
      case 'hue':
        return {};
      case 'lift':
        return {};
      default:
        return false;
    }
  }
}

export default LightInterface;
