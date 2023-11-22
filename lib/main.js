const cloudinary = require('cloudinary').v2;
const { _ } = require('golgoth');
const { error: firostError, spinner } = require('firost');
module.exports = {
  progressMax: null,
  progressCurrent: 0,
  progressStep: 100,
  progress: null,
  async run() {
    // Setup
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    this.progressMax = await this.imageCount();
    this.progress = spinner();

    await this.deleteAllImages();
  },
  /**
   * Start deleting all images in a loop
   * @param {string} currentCursor Where to start in the enumeration
   **/
  async deleteAllImages(currentCursor) {
    this.progress.tick(
      `[${this.progressCurrent}/${this.progressMax}] Fetching images`
    );
    const { nextCursor, imageIds } = await this.getNextImages(currentCursor);

    // Stop if all images deleted
    if (!nextCursor) {
      this.progress.success('All images deleted');
      return;
    }

    this.progress.tick(
      `[${this.progressCurrent}/${this.progressMax}] Deleting images`
    );
    await this.deleteImages(imageIds);

    this.progressCurrent += this.progressStep;
    await this.deleteAllImages(nextCursor);
  },
  /**
   * Get a batch of images
   * @param {string} cursor Start cursor
   * @returns {object} Object with nextCursor and array of imageIds
   **/
  async getNextImages(cursor) {
    const results = await this.executeSearch(cursor);
    const imageIds = _.map(results.resources, 'public_id');
    return {
      nextCursor: results.next_cursor,
      imageIds,
    };
  },
  /**
   * Delete images from their ids
   * @param {Array} images List of ids to delete
   **/
  async deleteImages(images) {
    try {
      await cloudinary.api.delete_resources(images, {
        type: 'fetch',
        resource_type: 'image',
      });
    } catch (e) {
      console.info(e);
      throw firostError('DELETE_IMAGES', e);
    }
  },
  /**
   * Returns the max number of resources
   * @returns {number} Number of resources
   **/
  async imageCount() {
    const results = await this.executeSearch();
    return results.total_count;
  },
  /**
   * Execute a search
   * @param {string} cursor Optional start cursor
   * @returns {object} Search result
   **/
  async executeSearch(cursor) {
    try {
      const search = new cloudinary.search();
      return await search.max_results(this.progressStep).execute({
        cursor,
      });
    } catch (e) {
      console.info(e);
      throw firostError('EXECUTE_SEARCH', e);
    }
  },
};
