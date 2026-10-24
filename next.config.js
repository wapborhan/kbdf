module.exports = {
  async redirects() {
    return ["/volunteer", "/volentear", "/volentier"].map((source) => ({ source, destination: "/volunteers", permanent: true }));
  },
};
