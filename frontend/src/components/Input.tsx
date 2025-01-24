interface InputProps {
    title: string;
    type: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string; // Add className prop
    name?:string
    value?:string
  }
  
  const Input = ({ title, type, placeholder, onChange,name,value }: InputProps) => {
    return (
      <div className="flex flex-col">
       <span className=""><label className="relative top-3 left-2 bg-repeat-space rounded-lg text-gray-400 bg-white px-1">{title}</label></span>  
        <input
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          name={name}
          value={value}
          className={`border border-gray-300  max-w-sm px-4 py-2 rounded-lg `}
        />
      </div>
    );
  };
  
  export default Input;