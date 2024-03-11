import renderer from 'react-test-renderer';
//ui
import { Circle } from './circle';
//types
import { ElementStates } from '../../../types/element-states';

describe('CIRCLE Component', () => {
    it('Рендер элемента без символов', () => {
        const tree = renderer
            .create(<Circle />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер элемента с символом', () => {
        const tree = renderer
            .create(<Circle letter='test'/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер элемента с тэгом head', () => {
        const tree = renderer
            .create(<Circle head='1'/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер элемента с react-элементом в head', () => {
        const tree = renderer
            .create(<Circle head={<Circle />}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер элемента с тэгом tail', () => {
        const tree = renderer
            .create(<Circle tail='1'/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер элемента с react-элементом в tail', () => {
        const tree = renderer
            .create(<Circle tail={<Circle />}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер элемента с индексом', () => {
        const tree = renderer
            .create(<Circle index={1}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер элемента с пропом isSmall ===  true', () => {
        const tree = renderer
            .create(<Circle isSmall={true} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер элемента в состоянии default', () => {
        const tree = renderer
            .create(<Circle state={ElementStates.Default} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер элемента в состоянии changing', () => {
        const tree = renderer
            .create(<Circle state={ElementStates.Changing} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер элемента в состоянии modified', () => {
        const tree = renderer
            .create(<Circle state={ElementStates.Modified} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});