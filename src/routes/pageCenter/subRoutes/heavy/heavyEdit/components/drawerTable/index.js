import React from "react";
import { Drawer } from "antd";

class DrawerTable extends React.Component {
    state = { visible: false };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { isShow, switchShow, children, title } = this.props;

        return (
            <div>
                <Drawer
                    width={"50%"}
                    title={title}
                    placement="right"
                    closable={true}
                    onClose={() => {
                        switchShow(false);
                    }}
                    visible={isShow}
                >
                    {children}
                </Drawer>
            </div>
        );
    }
}

export default DrawerTable;
