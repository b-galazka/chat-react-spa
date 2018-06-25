import React from 'react';
import { render } from 'react-dom';
import ShallowRenderer from 'react-test-renderer/shallow';

import MessageContent from './MessageContent';

describe('MessageContent component', () => {

    let renderer;

    beforeEach(() => {

        renderer = new ShallowRenderer();
    });

    it('should render without crash', () => {

        render(
            <MessageContent>lorem ipsum</MessageContent>,
            document.createElement('div')
        );
    });

    it('should render array of text and http, https and ftp links', () => {

        const urlHttp = 'http://loremipsum.com';
        const urlHttps = 'https://loremipsum.com';
        const urlFtp = 'ftp://loremipsum.com';

        renderer.render(
            <MessageContent>
                some text {urlHttp} another text{urlHttps}  text {urlFtp}
            </MessageContent>
        );

        const output = renderer.getRenderOutput();

        expect(output).toEqual([
            'some text ',
            <a href={urlHttp} key={2} target="_blank">{urlHttp}</a>,
            ' another text',
            <a href={urlHttps} key={4} target="_blank">{urlHttps}</a>,
            '  text ',
            <a href={urlFtp} key={7} target="_blank">{urlFtp}</a>
        ]);
    });
});