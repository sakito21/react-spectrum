/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2019 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/

import assert from 'assert';
import {DragTarget, IndexPath, Point, Rect, Size} from '@react/collection-view';
import sinon from 'sinon';
import TableViewLayout from '../../src/TableView/js/TableViewLayout';

describe('TableViewLayout', function () {
  it('should get a drop insertion indicator', function () {
    let layout = new TableViewLayout();
    layout.component = {props: {dropPosition: 'between'}};
    layout.collectionView = {
      size: new Size(100, 100),
      getNumberOfSections: () => 1,
      getSectionLength: () => 100,
      delegate: {
        indentationForItem: () => 0
      },
      _dropTarget: new DragTarget('item', new IndexPath(0, 5), DragTarget.DROP_BETWEEN)
    };
    layout.validate();

    let layoutInfos = layout.getVisibleLayoutInfos(new Rect(0, 0, 100, 100));
    let insertionIndicator = layoutInfos.find(l => l.type === 'insertion-indicator');
    assert(insertionIndicator);
    assert.deepEqual(insertionIndicator.rect, new Rect(0, 5 * 48 - 1, 100, 2));

    insertionIndicator = layout.getLayoutInfo('insertion-indicator');
    assert(insertionIndicator);
    assert.deepEqual(insertionIndicator.rect, new Rect(0, 5 * 48 - 1, 100, 2));
  });

  it('should not get a drop insertion indicator if the table is empty', function () {
    let layout = new TableViewLayout();
    layout.component = {props: {dropPosition: 'between'}};
    layout.collectionView = {
      size: new Size(100, 100),
      getNumberOfSections: () => 1,
      getSectionLength: () => 0,
      delegate: {
        indentationForItem: () => 0
      },
      _dropTarget: new DragTarget('item', new IndexPath(0, 5), DragTarget.DROP_BETWEEN)
    };
    layout.validate();

    let layoutInfos = layout.getVisibleLayoutInfos(new Rect(0, 0, 100, 100));
    let insertionIndicator = layoutInfos.find(l => l.type === 'insertion-indicator');
    assert(!insertionIndicator);

    insertionIndicator = layout.getLayoutInfo('insertion-indicator');
    assert(!insertionIndicator);
  });

  it('should get a drop target with dropPosition="on"', function () {
    let layout = new TableViewLayout();
    layout.component = {props: {dropPosition: 'on'}};
    let indexPathAtPoint = sinon.stub().returns(new IndexPath(0, 5));
    layout.collectionView = {
      size: new Size(100, 100),
      getNumberOfSections: () => 1,
      getSectionLength: () => 100,
      indexPathAtPoint
    };

    let target = layout.getDropTarget(new Point(0, 100));
    assert.deepEqual(indexPathAtPoint.getCall(0).args[0], new Point(0, 100));
    assert.deepEqual(target, new DragTarget('item', new IndexPath(0, 5), DragTarget.DROP_ON));
  });

  it('should get a drop target on the whole table with dropPosition="on"', function () {
    let layout = new TableViewLayout();
    layout.component = {props: {dropPosition: 'on'}};
    let indexPathAtPoint = sinon.stub().returns(null);
    layout.collectionView = {
      size: new Size(100, 100),
      getNumberOfSections: () => 1,
      getSectionLength: () => 100,
      indexPathAtPoint
    };

    let target = layout.getDropTarget(new Point(0, 100));
    assert.deepEqual(indexPathAtPoint.getCall(0).args[0], new Point(0, 100));
    assert.deepEqual(target, new DragTarget('item', new IndexPath(0, 0), DragTarget.DROP_BETWEEN));
  });

  it('should get a drop target with dropPosition="between"', function () {
    let layout = new TableViewLayout();
    layout.component = {props: {dropPosition: 'between'}};
    let indexPathAtPoint = sinon.stub().returns(new IndexPath(0, 5));
    layout.collectionView = {
      size: new Size(100, 100),
      getNumberOfSections: () => 1,
      getSectionLength: () => 100,
      indexPathAtPoint
    };

    let target = layout.getDropTarget(new Point(0, 100));
    assert.deepEqual(indexPathAtPoint.getCall(0).args[0], new Point(0, 100 + 24));
    assert.deepEqual(target, new DragTarget('item', new IndexPath(0, 5), DragTarget.DROP_BETWEEN));
  });

  it('should get a drop target at the end with dropPosition="between"', function () {
    let layout = new TableViewLayout();
    layout.component = {props: {dropPosition: 'between'}};
    let indexPathAtPoint = sinon.stub().returns(null);
    layout.collectionView = {
      size: new Size(100, 100),
      getNumberOfSections: () => 1,
      getSectionLength: () => 100,
      indexPathAtPoint
    };

    let target = layout.getDropTarget(new Point(0, 100));
    assert.deepEqual(indexPathAtPoint.getCall(0).args[0], new Point(0, 100 + 24));
    assert.deepEqual(target, new DragTarget('item', new IndexPath(0, 100), DragTarget.DROP_BETWEEN));
  });

  describe('indexPathAbove and indexPathBelow', () => {
    let layout = new TableViewLayout;
    layout.collectionView = {size: new Size(100, 100), getSectionLength: () => 100};

    it('should call collectionView incrementIndexPath', () => {
      const incrementIndexPath = sinon.spy();
      const indexPath = {section: 0, index: 1};
      layout.collectionView.incrementIndexPath = incrementIndexPath;
      layout.indexPathAbove(indexPath);
      assert.equal(incrementIndexPath.callCount, 1);
      assert.deepEqual(incrementIndexPath.getCall(0).args, [indexPath, -1]);
      layout.indexPathBelow(indexPath);
      assert.equal(incrementIndexPath.callCount, 2);
      assert.deepEqual(incrementIndexPath.getCall(1).args, [indexPath, 1]);
    });
  });
});