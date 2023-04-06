import { useCallback, useEffect, useRef, useState } from 'react';
import type { NodeItem } from './utils';
import { binarySearch, generateNodes } from './utils';

export interface Config {
  itemList: string[];
  offsetTop?: number;
  navBarOffsetTop?: number;
  navBarId?: string;
  scrollEndId?: string;
  scrollEndOffsetTop?: number;
}

export const createNav = (config: Config) => {
  const {
    itemList = [],
    offsetTop = 0,
    navBarOffsetTop = 0,
    navBarId,
    scrollEndId = itemList[itemList.length - 1],
    scrollEndOffsetTop = 0,
  } = config;
  const [activeIndex, setActiveIndex] = useState(-1);
  const activeIndexRef = useRef(activeIndex);
  const lastActiveIndexRef = useRef(0);
  const lastScrollTopRef = useRef(0);

  const [isPinned, setIsPinned] = useState(false);
  const isPinnedRef = useRef(isPinned);

  const [isScrollEnded, setIsScrollEnded] = useState(false);
  const isScrollEndedRef = useRef(isScrollEnded);
  const scrollEndNodeRef = useRef<HTMLElement | null>(null);
  const scrollEndNodeBottomOffsetTopRef = useRef(0);

  const staticNavBarOffsetTopRef = useRef(0);
  const navBarLastSiblingRef = useRef<HTMLDivElement>(document.createElement('div'));

  const [items, setItems] = useState(itemList);
  const nodesRef = useRef<NodeItem[]>([]);

  const observerCallback = useCallback(() => {
    if (!scrollEndNodeRef.current) {
      scrollEndNodeRef.current = document.getElementById(scrollEndId);
    } else {
      const { offsetTop, offsetHeight } = scrollEndNodeRef.current;
      scrollEndNodeBottomOffsetTopRef.current = offsetTop + offsetHeight;
    }
    staticNavBarOffsetTopRef.current = navBarLastSiblingRef.current.offsetTop;
    nodesRef.current = generateNodes(items, offsetTop);
  }, [scrollEndId, offsetTop, items]);

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

    if (!nodesRef.current.length) nodesRef.current = generateNodes(items, offsetTop);
    if (!nodesRef.current.length) return;

    if (navBarId && staticNavBarOffsetTopRef.current) {
      const nPinned = scrollTop >= staticNavBarOffsetTopRef.current - navBarOffsetTop;
      if (isPinnedRef.current !== nPinned) {
        setIsPinned(nPinned);
        isPinnedRef.current = nPinned;
      }
    }

    if (scrollEndNodeRef.current && scrollEndNodeBottomOffsetTopRef.current) {
      const nScrollIsEnded = scrollTop > scrollEndNodeBottomOffsetTopRef.current - scrollEndOffsetTop;

      if (isScrollEndedRef.current !== nScrollIsEnded) {
        setIsScrollEnded(nScrollIsEnded);
        isScrollEndedRef.current = nScrollIsEnded;
      }
    }

    // 获取到 [目标节点的区域范围, 目标节点Index]
    const target = binarySearch(nodesRef.current, scrollTop, {
      [lastScrollTopRef.current > scrollTop ? 'right' : 'left']: lastActiveIndexRef.current,
    });
    lastScrollTopRef.current = scrollTop;
    const nActiveIndex = target ? (lastActiveIndexRef.current = target[1]) : -1;
    if (activeIndexRef.current !== nActiveIndex) {
      setActiveIndex(nActiveIndex);
      activeIndexRef.current = nActiveIndex;
    }
  }, [navBarId, offsetTop, navBarOffsetTop, scrollEndOffsetTop, items]);

  const scrollToIndexDom = useCallback((index: number, behavior: 'auto' | 'smooth' = 'smooth') => {
    if (nodesRef.current[index]) window.scrollTo({ top: nodesRef.current[index].min + 1, behavior });
  }, []);

  useEffect(() => {
    if (itemList.join('_') !== items.join('_')) setItems(itemList);
  }, [itemList, items]);

  useEffect(() => {
    if (navBarId) {
      const navBar = document.getElementById(navBarId)!;
      const parentElement = navBar.parentElement!;

      parentElement.insertBefore(navBarLastSiblingRef.current, navBar);
      staticNavBarOffsetTopRef.current = navBarLastSiblingRef.current.offsetTop;
    }
  }, [navBarId]);

  useEffect(() => {
    if (scrollEndId) scrollEndNodeRef.current = document.getElementById(scrollEndId);
  }, [scrollEndId]);

  useEffect(() => {
    const MutationObserver = window.MutationObserver;
    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
    window.addEventListener('resize', observerCallback);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', observerCallback);
    };
  }, [observerCallback]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return {
    activeIndex,
    setActiveIndex: scrollToIndexDom,
    isPinned,
    isScrollEnded,
    scrollEndDistance: scrollEndNodeBottomOffsetTopRef.current - scrollEndOffsetTop,
  };
};
