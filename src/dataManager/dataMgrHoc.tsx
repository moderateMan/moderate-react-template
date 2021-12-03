import React from "react";
import dataMgr from '@DATA_MANAGER/index'


type WrappedComponentPropsT = {
  [key: string]: any;
};

function dataMgrHoc(...stores:Array<string>) {
  const inject = dataMgr.injectNaturStore;
  return function (WrappedComponent: any) {
    @inject(...stores)
    class HOC extends React.Component<WrappedComponentPropsT> {
      constructor(props:WrappedComponentPropsT){
          super(props)
          this.dataMgr = dataMgr.getMgr(stores)
      }
      dataMgr:any
      render() {
        return <WrappedComponent {...this.props} dataMgr = {this.dataMgr} />;
      }
    }
    return HOC;
  };
}

export default dataMgrHoc;
