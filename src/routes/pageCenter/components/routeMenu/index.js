import React, { useEffect, useState } from 'react'
import {ROUTES_LOCAL_ID} from 'ROUTES/config';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
const {DOC_ID} = ROUTES_LOCAL_ID;

const { TreeNode } = Tree;
export default (props) => {
  const { subRoutesConfig, handleTreeDataChange, intlData } = props;
  const [treeData, setTreeData] = useState([])
  useEffect(() => {
    setTreeData(subRoutesConfig)
  }, [subRoutesConfig])
  let onDragEnter = info => {
  };
  let onDrop = info => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    //落在一个条目内部
    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    
    setTreeData(data)
    handleTreeDataChange(data);
  };
  let loop = data =>
    data.map(item => {
      if(item.menuId === DOC_ID){
        return
      }
      if (item.children && item.children.length) {
        return (
          <TreeNode icon={({ selected }) => <LegacyIcon type={item.icon} />}  key={item.key} title={intlData[item.name]||item.name}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode icon={({ selected }) => <LegacyIcon type={item.icon} />} key={item.key} title={intlData[item.name]||item.name} />;
    });
  return (
    <Tree
      showIcon
      showLine
      switcherIcon={<DownOutlined />}
      className="draggable-tree"
      draggable
      blockNode
      style={{
        height: 'calc(100% - 64px)',
        paddingLeft: 15,
        paddingTop: 5
      }}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
    >
      {loop(treeData)}
    </Tree>
  );
}