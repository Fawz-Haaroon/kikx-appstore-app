export class AppInstaller {
  constructor(app) {
    this.app = app;
    this.tempId = null;
    this.manifest = null;
  }

  // Get app preview url
  getPreviewUrl = file => {
    return this.app.getUrl(
      `${this.app.system.baseURL}/app/preview/${this.tempId}/${file}`
    );
  };

  // Prepare package
  async prepare(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await this.app.system.request(
      "app/prepare-install",
      "POST",
      formData,
      false
    );

    if (!res.ok) {
      throw new Error(res.error.detail);
    }

    this.tempId = res.data.temp_id;
    this.manifest = res.data.manifest;

    return res.data;
  }

  // Prepare package from github
  async prepare_github(url, tag = null) {
    tag ? `&tag=${tag}` : "";

    const res = await this.app.system.request(
      `app/prepare-github?repo_url=${url}`,
      "POST"
    );

    if (!res.ok) {
      throw new Error(res.error.detail);
    }

    this.tempId = res.data.temp_id;
    this.manifest = res.data.manifest;

    return res.data;
  }

  // Install app
  async install() {
    if (!this.tempId) {
      throw new Error("No prepared installation session");
    }

    const res = await this.app.system.request(
      `app/confirm-install?temp_id=${this.tempId}`,
      "POST"
    );

    if (!res.ok) {
      throw new Error(res.error.detail);
    }

    this.tempId = null;
    return res.data;
  }

  // Cancel Install and clear prepared package
  async cancel() {
    if (!this.tempId) {
      return { res: "already_cancelled" };
    }

    const res = await this.app.system.request(
      `app/cancel-install?temp_id=${this.tempId}`,
      "POST"
    );

    this.tempId = null;

    if (!res.ok) {
      throw new Error(res.error.detail);
    }

    return res.data;
  }
}

