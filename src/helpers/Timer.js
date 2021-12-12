class Timer{
	static trackers = []
	
	static start( callback, delay ){
		const start = Date.now();
		const id = window.setTimeout(callback, delay)
		Timer.trackers.push({
			id: id,
			remaining: delay,
			start: start,
			callback: callback,
			status: 'running'
		})
		return id
	}
	
	static pause(id){
		window.clearTimeout(id);
		console.log('current time cleared, id = ', id)
		const timer = Timer.trackers.find( item => item.id === id )
		if(timer) {
			timer.remaining -= Date.now() - timer.start;
			timer.status = 'paused'
			const index = Timer.trackers.findIndex( item => item.id === id )
			if(index >=0 ) Timer.trackers.splice( index, 1, timer )
		}
		else{
			console.log('timer was not found')
		}
		console.log('current trackers:')
		console.log(Timer.trackers)
	}
	
	static resume(id){
		const timer = Timer.trackers.find( item => item.id === id )
		if(timer) {
			const newId = 0>1 ? Timer.start( timer.callback, timer.remaining ) : 0
			const index = Timer.trackers.findIndex( item => item.id === id )
			if(index >= 0) Timer.trackers.splice( index, 1 )
			if(newId===0) console.log("We are not restarting this timer")
			return newId;
		}
		return id
	}
	
}

export default Timer