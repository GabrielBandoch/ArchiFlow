import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  forwardRef,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export interface SelectOption {
  value: any;
  label: string;
  subLabel?: string;
  icon?: string;
}

@Component({
  selector: "app-select",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./select.component.html",
  styleUrl: "./select.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() id = "";
  @Input() placeholder = "Selecione...";
  @Input() label?: string;
  @Input() options: SelectOption[] = [];
  @Input() required = false;
  @Input() error?: string;

  @ViewChild("triggerBtn") triggerBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild("optionsContainer") optionsContainer?: ElementRef<HTMLElement>;

  value: any = null;
  disabled = false;
  isOpen = false;
  dropdownStyles: Record<string, string> = {};

  private listener?: (event: Event) => void;
  private repositionListener?: (event: Event) => void;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.listener = (event: Event) => {
      if (
        this.isOpen &&
        !this.elementRef.nativeElement.contains(event.target as Node)
      ) {
        this.isOpen = false;
        this.onTouched();
      }
    };

    this.repositionListener = (event: Event) => {
      if (!this.isOpen) return;
      if (
        event.type === "scroll" &&
        this.optionsContainer?.nativeElement?.contains(event.target as Node)
      ) {
        return;
      }
      this.ngZone.run(() => this.updateDropdownPosition());
    };

    window.addEventListener("click", this.listener, true);
    window.addEventListener("focusin", this.listener, true);
    window.addEventListener("resize", this.repositionListener, true);
    window.addEventListener("scroll", this.repositionListener, true);
  }

  ngOnDestroy(): void {
    if (this.listener) {
      window.removeEventListener("click", this.listener, true);
      window.removeEventListener("focusin", this.listener, true);
    }
    if (this.repositionListener) {
      window.removeEventListener("resize", this.repositionListener, true);
      window.removeEventListener("scroll", this.repositionListener, true);
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.updateDropdownPosition();
      } else {
        this.onTouched();
      }
    }
  }

  private updateDropdownPosition(): void {
    const trigger = this.triggerBtn?.nativeElement;
    if (!trigger || typeof window === "undefined") return;

    const rect = trigger.getBoundingClientRect();
    const margin = 8;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const openUpward = spaceBelow < 180 && spaceAbove > spaceBelow;
    const availableSpace = openUpward ? spaceAbove : spaceBelow;
    const maxHeight = Math.min(240, Math.max(120, availableSpace));

    this.dropdownStyles = {
      position: "fixed",
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      maxHeight: `${maxHeight}px`,
      zIndex: "2000",
      top: openUpward ? "auto" : `${rect.bottom + 4}px`,
      bottom: openUpward ? `${window.innerHeight - rect.top + 4}px` : "auto",
    };
  }

  selectOption(option: SelectOption): void {
    this.value = option.value;
    this.onChange(this.value);
    this.isOpen = false;
    this.onTouched();
  }

  getSelectedOption(): SelectOption | undefined {
    return this.options.find((opt) => String(opt.value) === String(this.value));
  }
}
