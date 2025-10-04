import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { AlertCircle } from "lucide-react";

function FormControls({ formControls = [], formData, setFormData, errors = {} }) {
  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";
    const hasError = errors[getControlItem.name];
    const isRequired = getControlItem.required !== false;

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <div className="relative">
            <Input
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              type={getControlItem.type}
              value={currentControlItemValue}
              className={`transition-all duration-200 ${
                hasError 
                  ? 'border-red-500 focus-visible:ring-red-500 bg-red-50' 
                  : 'focus-visible:ring-blue-500'
              }`}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />
            {hasError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
        );
        break;
      case "select":
        element = (
          <div className="relative">
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
                })
              }
              value={currentControlItemValue}
            >
              <SelectTrigger className={`w-full transition-all duration-200 ${
                hasError 
                  ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                  : 'focus:ring-blue-500'
              }`}>
                <SelectValue placeholder={getControlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            {hasError && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
        );
        break;
      case "textarea":
        element = (
          <div className="relative">
            <Textarea
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              value={currentControlItemValue}
              className={`min-h-[100px] transition-all duration-200 ${
                hasError 
                  ? 'border-red-500 focus-visible:ring-red-500 bg-red-50' 
                  : 'focus-visible:ring-blue-500'
              }`}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />
            {hasError && (
              <div className="absolute right-3 top-3">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
        );
        break;

      default:
        element = (
          <div className="relative">
            <Input
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              type={getControlItem.type}
              value={currentControlItemValue}
              className={`transition-all duration-200 ${
                hasError 
                  ? 'border-red-500 focus-visible:ring-red-500 bg-red-50' 
                  : 'focus-visible:ring-blue-500'
              }`}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />
            {hasError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-4">
      {formControls.map((controleItem) => {
        const hasError = errors[controleItem.name];
        const isRequired = controleItem.required !== false;
        
        return (
          <div key={controleItem.name} className="space-y-2">
            <Label 
              htmlFor={controleItem.name}
              className={`flex items-center gap-1 font-medium ${
                hasError ? 'text-red-600' : 'text-gray-700'
              }`}
            >
              {controleItem.label}
              {isRequired && <span className="text-red-500">*</span>}
            </Label>
            {renderComponentByType(controleItem)}
            {hasError && (
              <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-3 w-3" />
                {errors[controleItem.name]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FormControls;
