import matrizes from '../../public/matrizes.json';

const matrizGerada = () => {
  const indiceAleatorio = Math.floor(Math.random() * matrizes.length);

  return matrizes[indiceAleatorio];
}

export const mazeLayout = matrizGerada()