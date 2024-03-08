/**
							BAD Alhgorithm
*/

function calcBADValues(dataArr) {
	const arrClone = dataArr.slice();
	const sortArr = mergeSort(arrClone);
	const maxValue = sortArr[sortArr.length - 1];
	const minValue = sortArr[0];
	const medianValue = getMedian(sortArr);
	const maxAscendingSequence = findSequence(arrClone, "ASC");
	const maxDescendingSequence = findSequence(arrClone, "DESC");
	const arithmeticMean = calcArithmeticMean(arrClone);
	
	return { maxValue, minValue, arithmeticMean, medianValue, maxAscendingSequence, maxDescendingSequence };
}


function mergeSort(unSortArr) {

	function merge(left, right) {
		const res = [];
		let li = 0;
		let ri = 0;
		
		while (li < left.length && ri < right.length) {
			if (left[li] < right[ri]) {
				res.push(left[li++]);
			} else {
				res.push(right[ri++]);
			}
		}

		//merge if arr has more elem
		return res.concat(left.slice(li)).concat(right.slice(ri));
	}

	function merge_sort(items) {
		if (items.length < 2) {
			return items;
		}

		const middle = Math.floor(items.length / 2);
		const left = items.slice(0, middle);
		const right = items.slice(middle);
		
		return merge(merge_sort(left), merge_sort(right));
	}

	return merge_sort(unSortArr);
}

function getMedian(arr) {
	let medianElemIndx = Math.floor(arr.length / 2);

	if (arr.length % 2 !== 0) { //if odd number - return index;
		return arr[medianElemIndx];
	}
	
	return (arr[medianElemIndx - 1] + arr[medianElemIndx]) / 2;
}

function findSequence(arr, direction) {
	let allSeq = [];
	let currentSeq = [arr[0]];
	
	const k = (() => {
		//when arr[i-1] < arr[i] this is ASC, but if -arr[i-1] < -arr[i] this is DESC, that reduce code and save functional
		if (direction === "ASC") return 1;
		else if (direction === "DESC") return -1;
		else throw new Error("Wrong direction");
	})();

	//find and save sequence
	for (let i = 1; i <= arr.length; i++) {
		// When i === arr.length, arr[i] === undefined, I can`t compare Undefined with Number BUT all compare <> with undefined return 'false' (but not null == undefined), it means arr[i - 1] < arr[i] return false and LAST sequence will be add to allSeq arr.
		if (k * arr[i - 1] < k * arr[i]) {
			currentSeq.push(arr[i]);
		} else {
			allSeq.push([...currentSeq]);
			currentSeq.length = 0;
			currentSeq.push(arr[i]);
		}
	}

	//iterate allSeq and find maxSeq
	const maxSeq = allSeq.reduce((maxSeq, elem) => {
		if (elem.length > maxSeq.length) {
			return elem;
		} else {
			return maxSeq;
		}
	}, []);

	return maxSeq;
}

function calcArithmeticMean(arr) {
	const sumOfElem = arr.reduce((acc, elem) => acc + elem);
	return sumOfElem / arr.length;
}

export default calcBADValues