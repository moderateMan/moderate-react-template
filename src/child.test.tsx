import React from 'react';
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Child from './routes/pageCenter/components/topNavigation/child';
import toJson from 'enzyme-to-json';
import { render, screen } from '@testing-library/react';

const {shallow}=Enzyme

Enzyme.configure({ adapter: new Adapter() })

describe('Enzyme shallow', function () {
  it('test toMatchSnapshot',  ()=>{
    let wrapper = render(<Child />)
    expect((wrapper)).toMatchSnapshot()
  })
})

