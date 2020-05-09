/**
 * Provide API light interaction
 *
 */
class LightInterface {
  get lightInfomation() {
    if (!this.authenticated) {
      return false;
    }
    switch (this.type) {
      case 'NANOLEAF':
        return this.axiosClient.get('').then((response) => response.data).catch((err) => {
          console.log(err);
        });
      case 'HUE':
        return {};
      case 'LIFT':
        return {};
      default:
        return false;
    }
  }
}

export default LightInterface;
