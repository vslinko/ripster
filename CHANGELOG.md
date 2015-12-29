## master

## December 22, 2015

* Replaced redux-router with rackt/redux-simple-router.
  * redux-simple-router is recommended as an officially supported version. see (#28)
  * ** migration notice **
  redux store (key) for routing state is changed from `router` to `routing`. This is to use the default key as mentioned in `redux-simple-router` documentation.


## Jul 18, 2015

* Initial public release.
