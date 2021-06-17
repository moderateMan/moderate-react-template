// import React from "react";
// import ReactCSSTransitionGroup from "react-addons-css-transition-group";
// import style from "./temp.module.css";


// const transationHoc = (WrappedComponent) => {
//     return class Container extends React.Component {
//         componentWillMount() {
//             document.body.style.margin = "0px";
//             // 这是防止页面被拖拽
//             document.body.addEventListener('touchmove', (ev) => {
//                 ev.preventDefault();
//             });
//         }
    
//         render() {
//             return (
//                 <ReactCSSTransitionGroup
//                     transitionName="transitionWrapper"
//                     component="div"
//                     className={style.transitionWrapper}
//                     transitionEnterTimeout={10000}
//                     transitionLeaveTimeout={10000}>
//                     <div key={window.location.pathname}
//                          style={{position:"absolute", width: "100%"}}>
//                         <WrappedComponent {...this.props} />
//                     </div>
//                 </ReactCSSTransitionGroup>
//             );
//         }
    
//     }
// };

// export default transationHoc;
