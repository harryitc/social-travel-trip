import Block from '../blots/block';
import Container from '../blots/container';
import Quill from "../core";
import { Blot, Root } from "../lib/parchment-3.0.0/parchment";
const vertical = "vertical"
const horizontal = "horizontal"
const class_Header = "quilljs-table-cell-header"
const class_Table = "quilljs-table"
const class_TableCell = "quilljs-table-cell"
const key_data_table = "data-table"
// const Defaults_Value = "default 3 horizontal"
const Defaults_Table_CellsInRow = 3
const NEWLINE_LENGTH = 1;
class TableCell extends Block {
  static blotName = 'table';
  static tagName = 'div';
  static className: string = class_TableCell
  // Constructor
  constructor(scroll: Root, public domNode: HTMLElement) {
    super(scroll, domNode);
  }
  static create(value: string) {
    const node = super.create() as HTMLElement;
    //Class name
    node.classList.add(class_TableCell)
    ///Check value
    if (value) {
      ///Set data
      TableCell.setTableData(node, value, { from: "create" })
    } else {
      node.setAttribute("data-is-default-table-cell", "true")
    }
    return node;
  }
  ///Set table-data to table cell node
  static setTableData(domNode: HTMLElement, table_data: string, debug?: any) {
    // console.log("TableCell.setTableData: debug = ", domNode, table_data, debug)
    //Set data
    domNode.setAttribute(key_data_table, table_data)
  }
  static getTableData(domNode: HTMLElement) {
    //Set data
    return domNode.getAttribute(key_data_table)
  }
  ///Register format
  static register() {
    Quill.register(Table);
  }
  static formats(domNode: HTMLDivElement, scroll: Root) {
    //TABLE
    const table: HTMLElement = domNode.parentElement
    //Cells in a row
    let cellsInRow: any = table.getAttribute('data-table-cells-in-row')
    const direction = table.getAttribute('data-table-direction')
    const index = Array.prototype.indexOf.call(table.children, domNode);
    const contains = domNode.classList.contains(class_Header)
    if (cellsInRow) {
      cellsInRow = +cellsInRow
      ///HORIZONTAL
      if (direction === horizontal) {
        if (index < cellsInRow && !contains) {
          domNode.classList.add(class_Header)
        }
        if (index >= cellsInRow && contains) {
          domNode.classList.remove(class_Header)
        }
      }
      ///VERTICAL
      if (direction === vertical) {
        const i = index % cellsInRow
        if (i === 0 && !contains) {
          domNode.classList.add(class_Header)
        }
        if (i !== 0 && contains) {
          domNode.classList.remove(class_Header)
        }

      }
    }
    ///Return table data
    return TableCell.getTableData(domNode)
  }
  static fixFocus(tableCell: TableCell, editorFocus: Function) {
    if (tableCell.domNode.innerHTML) {
      return;
    }
    tableCell.domNode.innerHTML = " "
    ///Editor focus
    editorFocus()
    //Re-empty cell
    setTimeout(() => {
      ///Remove SPACE
      tableCell.domNode.innerHTML = ""
    })
  }

  format(name: string, value: string) {
    if (name === Table.blotName && !value) {
    } else {
      super.format(name, value);
    }
  }

  remove() {
    if (this.prev == null && this.next == null) {
      this.parent.remove();
    } else {
      ///Check header
      this.checkHeaderCells()
      //Remove
      super.remove();
    }
  }

  replaceWith(name: string | Blot, value?: any) {
    this.parent.isolate(this.offset(this.parent), this.length());
    if (name === this.parent.statics.blotName) {
      this.parent.replaceWith(name, value);
      return this;
    } else {
      this.parent.unwrap();
      return super.replaceWith(name, value);
    }
  }
  insertBefore(childBlot: any, refBlot: any) {
    const domNode = this.domNode as HTMLElement
    if (domNode.classList.contains(class_Table)) {
      this.cache = {};
      return;
    }
    super.insertBefore(childBlot, refBlot)
  }
  /**
   * When insert new Table Cell
   * @param index 
   * @param value 
   * @param def 
   */
  public insertAt(index: number, value: string, def?: any): void {
    ///Check header
    this.checkHeaderCells()
    ///Insert new TableCell in last cell
    super.insertAt(index, value, def)

  }
  public clone(): Blot {
    const domNode = this.domNode.cloneNode(false) as HTMLInputElement;
    ///Clean class
    domNode.classList.remove(class_Header)
    ///Create
    return this.scroll.create(domNode);
  }
  public cloneToEmptyCell(): Blot {
    const domNode = this.domNode.cloneNode(false) as HTMLInputElement;
    ///Clean class
    domNode.classList.remove(class_Header)
    ///FIX Editor Focus on Empty Cell:
    if (!domNode.innerHTML) {
      ///Insert Space for focus!
      domNode.innerHTML = " "
      setTimeout(() => {
        domNode.innerHTML = ""
      })
    }
    ///FIX Editor Focus on Empty Cell.
    ///Create
    return this.scroll.create(domNode);
  }
  split(index: number, force: boolean | undefined = false): Blot | null {
    ///First or LAST position
    if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
      const clone = this.cloneToEmptyCell();
      if (index === 0) {
        this.parent.insertBefore(clone, this);
        return this;
      }
      this.parent.insertBefore(clone, this.next);
      return clone;
    }
    ///TRUE SPLIT!!!!
    const next = super.split(index, force);
    this.cache = {};
    return next;
  }
  public optimize(_context?: { [key: string]: any }): void {
    this.cache = {};
    if (this.parent instanceof this.statics.requiredContainer) {
      return;
    }
    ///Wrap
    const data_table = TableCell.getTableData(this.domNode)
    this.wrap(this.statics.requiredContainer.blotName, data_table);
  }
  /**
   * Check header
   * @returns 
   */
  checkHeaderCells() {
    ///Table
    const table: HTMLElement = this.domNode.parentElement
    //Cells in a row
    const cellsInRow: number = +table.getAttribute('data-table-cells-in-row')
    const direction = table.getAttribute('data-table-direction')
    const tableCellCount = table.childElementCount
    const currentCellIndex = Array.prototype.indexOf.call(table.children, this.domNode);
    ///HORIZONTAL
    if (direction === horizontal) {
      for (let index = currentCellIndex + 1; index < tableCellCount; index++) {
        if (index < cellsInRow) {
          table.children[index].classList.add(class_Header)
        } else {
          table.children[index].classList.remove(class_Header)
        }
      }
    }
    ///VERTICAL
    if (direction === vertical) {
      for (let index = currentCellIndex + 1; index < tableCellCount; index++) {
        if (index % cellsInRow === 0) {
          table.children[index].classList.add(class_Header)
        } else {
          table.children[index].classList.remove(class_Header)
        }
      }
    }
  }
}



class Table extends Container {
  static blotName = 'table-container';
  static tagName = 'div';
  static defaultChild = TableCell
  static allowedChildren = [TableCell];
  //Constructor
  constructor(scroll: Root, public domNode: HTMLDivElement) {
    super(scroll, domNode as HTMLElement);
  }
  static create(value: string) {
    let tagName = 'DIV';
    let node: HTMLDivElement = super.create(tagName) as HTMLDivElement;
    ///Check type | rowCount | direction
    let [type, cellsInRow, direction] = value.split(" ")
    if (type && !cellsInRow && !direction) {
      cellsInRow = `${Defaults_Table_CellsInRow}`
      direction = type
      type = "default"
    }
    direction = direction ?? horizontal
    node.setAttribute("data-table-type", type)
    node.setAttribute("data-table-cells-in-row", cellsInRow)
    node.setAttribute("data-table-direction", direction)
    ///Cell per row
    let autos = ""
    const cellCount = +cellsInRow
    for (let index = 0; index < cellCount; index++) {
      autos += " auto"
    }
    node.style["grid-template-columns"] = autos
    //Class name
    node.classList.add("quilljs-table", "quilljs-table-" + direction)
    //Return node
    return node;
  }

  format(name: string, value: string) {
    if (this.children.length > 0) {
      const tableCell = this.children.tail as TableCell
      tableCell.format(name, value);
    }
  }

  insertBefore(blot: any, ref: any) {
    if (blot instanceof TableCell) {
      super.insertBefore(blot, ref);
      return
    }
    let index = ref == null ? this.length() : ref.offset(this);
    let after = this.split(index);
    after && after.parent.insertBefore(blot, after);
  }
  /**
   * When insert new Table Cell
   * @param index 
   * @param value 
   * @param def 
   */
  public insertAt(index: number, value: string, def?: any): void {
    ///Insert new TableCell in last cell
    super.insertAt(index, value, def)
  }

  optimize(context: any) {
    let next = this.next;
    ///NEXT
    if (!next) {
      return
    }
    const nextNode: HTMLDivElement = next.domNode as HTMLDivElement
    const nextStatics = next.statics
    ///Collecting
    if (next.prev === this &&
      nextStatics.blotName === this.statics.blotName &&
      nextNode.tagName === this.domNode.tagName) {
      next.moveChildren(this);
      next.remove();
    }
    ///Remove empty table automatically added
    if (nextNode.classList.contains(class_Table) && nextStatics.blotName === TableCell.blotName) {
      next.remove()
    }
  }
}
//Static
TableCell.requiredContainer = Table
///Exports
export {
  TableCell,
  Table as default,
  Defaults_Table_CellsInRow
};
