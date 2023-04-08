[![npm version](https://img.shields.io/npm/v/scroll-spyoom)](https://www.npmjs.com/package/scroll-spyoom) ![npm bundle size](https://img.shields.io/bundlephobia/min/scroll-spyoom)

![Scroll-Spyoom](https://cdn.jsdelivr.net/gh/zengzjie/picgo-image@main/static_files/202304081545877.png)

A library for intelligent detection of current rolling position and activation of node position based on MutationObserver API

## Features

- High Performance
- Friendly To Use
- Typrscript Support
- Lightweight ( 2kb or less by ES Module treeshaking )

## Installation

```shell
$ npm install scroll-spyoom
```

## Usage

> You can copy the simple example to your local project and try it out to see the effect.

```tsx
import { useEffect, useState } from 'react';
import { createNav } from 'scroll-spyoom';
import './index.less';

function rgb() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  let rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
  return rgb;
}

const itemList = Array.from({ length: 5 }, () => rgb());

const offsetTop = 0;
const navBarId = 'nav';
const navBarOffsetTop = -40;
const scrollEndOffsetTop = 80;

const Test = () => {
  const [isHeaderShow, setIsHeaderShow] = useState(true);
  
	const { 
    activeIndex, 
    setActiveIndex, 
    isPinned, 
    isScrollEnded, 
    scrollEndDistance 
  } = createNav({
    itemList,
    navBarId,
    offsetTop,
    navBarOffsetTop,
    scrollEndOffsetTop
  });
  
  useEffect(() => {
    setIsHeaderShow(!isPinned || isScrollEnded);
  }, [isPinned, isScrollEnded]);
  
  const handleTo = () => {
    setActiveIndex(2, 'smooth');
  };
  
  return (
    <div className="test">
      <div onClick={handleTo}>跳转</div>
      <header style={{ opacity: isHeaderShow ? 1 : 0, background: 'red' }}>顶部内容</header>
      <div style={{ height: '300px' }}>内容块</div>
      <div className={`navBar ${isScrollEnded ? ' scrollEndNav' : ''}`} id={navBarId}>
        {isPinned ? (
          <div className="pinnedNav" style={{ top: scrollEndDistance - 60 + 'px' }}>
            pinned样式，激活元素：{activeIndex}
          </div>
        ) : (
          <div>
            static静态样式, navBarOffsetTop：{navBarOffsetTop}，当前激活元素
            {activeIndex}
          </div>
        )}
      </div>
      {itemList.map((item, index) => (
        <div id={item} key={item} style={{ background: item, height: '200px', lineHeight: '200px' }}>
          元素{index}距顶{offsetTop}px激活；
          {activeIndex === index && '激活中'}
        </div>
      ))}
      <div style={{ height: '1000px' }}>底部元素</div>
    </div>
  )
};

export default Test;
```

> index.less

```less
.test {
  font-family: sans-serif;
  text-align: center;
  header {
    position: sticky;
    top: 0;
    z-index: 10;
    transition: opacity 1s;
  }

  .navBar {
    --top: 0px;

    height: 60px;
    background-color: pink;
    position: sticky;
    top: -60px;

    & > div {
      height: inherit;
      line-height: 60px;
    }
  }

  .pinnedNav {
    transform: translateY(80px);
    transition: transform 0.3s;
    background-color: yellow;
  }

  .scrollEndNav {
    position: static;

    & > .pinnedNav {
      background-color: blue;
      position: absolute;
      width: 100%;
    }
  }
}

```

## Auto Resize Detection

You don't have to worry about "resize". You can change the size as much as you want, and Scroll-Spyoom will always worked.

## Browser Compatibility

Same with [Mutation Observer](https://caniuse.com/?search=Mutation%20Observer). You can optimize the compatibility by including [polyfill](https://github.com/w3c/IntersectionObserver#readme).

```shell
$ npm install mutationobserver-shim --save-dev
```

Use it in your JavaScript file.

```tsx
const observer = new window.MutationObserver(callback);
```

Now you can use `MutationObserver`, and `mutationobserver-shim` will provide support for it in browsers that do not support the native API. This is a simple way to provide cross-browser support for `MutationObserver` using the `mutationobserver-shim` package. You can easily use `MutationObserver` in your project without worrying about browser compatibility issues.
