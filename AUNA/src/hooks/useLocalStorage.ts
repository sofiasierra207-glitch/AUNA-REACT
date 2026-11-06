import { useEffect, useState } from 'react';

// custom hook: funciona igual que useState pero ademas guarda el valor en localStorage
// asi los likes y los guardados no se borran cuando recargo la pagina
// lo uso en Explore (likes y guardados) y en Favorites (guardados)
// <T> es para que sirva con cualquier tipo de dato (un array de numeros, un texto...)
function useLocalStorage<T>(clave: string, valorInicial: T) {
    // leo lo que ya estaba guardado
    // le paso una funcion a useState para que solo lea localStorage la primera vez
    const [valor, setValor] = useState<T>(() => {
        const guardado = localStorage.getItem(clave);
        // JSON.parse convierte el texto otra vez en array/objeto
        return guardado ? (JSON.parse(guardado) as T) : valorInicial;
    });

    // cada vez que el valor cambia lo vuelvo a guardar
    // JSON.stringify lo convierte en texto porque localStorage solo guarda texto
    useEffect(() => {
        localStorage.setItem(clave, JSON.stringify(valor));
    }, [clave, valor]);

    // devuelvo lo mismo que useState: el valor y la funcion para cambiarlo
    return [valor, setValor] as const;
}

export default useLocalStorage;