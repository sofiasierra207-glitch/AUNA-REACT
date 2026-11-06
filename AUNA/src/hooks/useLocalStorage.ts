import { useEffect, useState } from 'react';

// custom hook: funciona igual que useState pero ademas guarda el valor en localStorage
// asi los likes y los guardados no se borran cuando recargo la pagina
// lo uso en Explore (likes y guardados) y en Favorites (guardados)
// <T> es para que sirva con cualquier tipo de dato (un array de numeros, un texto...)
function useLocalStorage<T>(key: string, initialValue: T) {
    // leo lo que ya estaba guardado
    // le paso una funcion a useState para que solo lea localStorage la primera vez
    const [value, setValue] = useState<T>(() => {
        const stored = localStorage.getItem(key);
        // JSON.parse convierte el texto otra vez en array/objeto
        return stored ? (JSON.parse(stored) as T) : initialValue;
    });

    // cada vez que el valor cambia lo vuelvo a guardar
    // JSON.stringify lo convierte en texto porque localStorage solo guarda texto
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    // devuelvo lo mismo que useState: el valor y la funcion para cambiarlo
    return [value, setValue] as const;
}

export default useLocalStorage;