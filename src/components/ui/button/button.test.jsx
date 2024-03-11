import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react';
//ui
import { Button } from './button';

describe('BUTTON Component', () => {
    it('Рендер кнопки с текстом', () => {
        const tree = renderer
            .create(<Button text='test' />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер кнопки без текста', () => {
        const tree = renderer
            .create(<Button />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер заблокированной кнопки', () => {
        const tree = renderer
            .create(<Button disabled />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Рендер кнопки с индикацией загрузки', () => {
        const tree = renderer
            .create(<Button isLoader={true} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Корректно вызывает колбек при клике на кнопку', () => {
        const callBack = jest.fn();
        render(<Button onClick={callBack}/>);
        fireEvent.click(screen.getByRole('button'));
        expect(callBack).toHaveBeenCalled();
    });
});