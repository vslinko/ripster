const req = require.context(
  'frontend/bundles',
  true,
  /^\.\/[a-z]+\/actionCreators(\/[a-z]+)?\.js$/i
);

const bundleInits = req
  .keys()
  .map(key => req(key).init)
  .filter(bundleInit => !!bundleInit);

export default function init() {
  return async (dispatch) => {
    await Promise.all(
      bundleInits.map(bundleInit => dispatch(bundleInit()))
    );
  };
}
